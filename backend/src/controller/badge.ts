import { IBadge } from "../models/badge.js";
import { ObjectId } from "mongodb";
import { tApi } from "./twitchAuth.js";
import { HelixChatBadgeSet, HelixChatBadgeVersion } from "@twurple/api";
import collections, { dbConnection } from "./dbConnection.js";
import { IUser } from "../models/user.js";



export class Badge implements IBadge {
    public name: string;
    public badgeUrl?: string | undefined;
    public version: string;
    public _id?: ObjectId | undefined;
    
    constructor (name:string, version:string, url?: string) {
        this.name = name;
        this.version = version;
        this.badgeUrl = url;
    }

    public async commitToDb(): Promise<void> {
        const dbConn = collections.badges;
        if (!!dbConn) {
            const searchQuery = {
                name: this.name,
                version: this.version
            };


            let searchResult: IBadge | undefined
            try {
                searchResult = await dbConn.findOne(searchQuery) as IBadge;
            } catch (error) {
                throw error;
            }

            if (!!searchResult && searchResult.badgeUrl !== this.badgeUrl) {
                console.debug(this.name + ' v:' + this.version + ' was found in the DB, updating');
                const updateQuery = {
                    $set: {
                        badgeUrl: this.badgeUrl
                    }
                };

                try {
                    const dbResult = await dbConn.updateOne(searchQuery,updateQuery);
                } catch (error) {
                    throw error;
                }
            }
            else if (!!searchResult && searchResult.badgeUrl === this.badgeUrl) {
                console.debug(this.name + ' v:' + this.version + ' was found in the DB');
            }
            else {
                console.debug(this.name + ' v:' + this.version + ' was not found in the DB');
                const dbResult = await dbConn.insertOne(this)
            }
        }
    }

    public async setBadgeUrl(): Promise<void> {
        const dbConn = collections.badges;

        if (!!dbConn) {
            const searchQuery = {
                name: this.name,
                version: this.version
            };

            let dbResult: IBadge
            try {
                dbResult = await dbConn.findOne(searchQuery) as IBadge;
            }
            catch (error) {
                throw error;
            }

            if (!!dbResult && !!dbResult.badgeUrl) {
                console.debug(this.name + ' v:' +this.version + ' was found in the DB');
                this.badgeUrl = dbResult.badgeUrl;
            }
            else {
                throw Error(this.name + ' was not found in the DB');
            }
        }
        else {
            throw Error('No DB connection');
        }
    }
}

export async function processBadges(badges: HelixChatBadgeSet[]):Promise<void> {
    for (let i = 0; i < badges.length; i++) {
        const badge = badges[i];
        for (let j = 0; j < badge.versions.length; j++) {
            const version = badge.versions[j];
            let url: string;

            try {
                url = version.getImageUrl(1);
            } catch (error) {
                throw error;
            }

            if (!!url) {
                const myBadge = new Badge(badge.id, version.id, url)
                try {
                    await myBadge.commitToDb();
                } catch (error) {
                    throw error;
                }
            }
            else {
                throw Error('not enough data to save badge ' + badge.id)
            }
        }
    }
}

export async function fetchGlobalBadges(): Promise<void> {
    let globalBadges: HelixChatBadgeSet[] | undefined;

    try {
        globalBadges = await tApi.chat?.getGlobalBadges();
    } catch (error) {
        throw error;
    }

    if (!!globalBadges) {
        await processBadges(globalBadges);
    }
    else {
        throw Error('Not enough data to save global badges');
    }
}

export async function fetchChannelBadges(username: string): Promise<void> {
    let streamer: IUser | undefined

    try {
        const response = await fetch('http://localhost:5000/user/id?username=' + username);
        streamer = await response.json() as IUser;
    } catch (error) {
        throw error;
    }

    if (!!streamer && !!streamer.twitchId) {
        let channelBadges: HelixChatBadgeSet[] | undefined;
        try {
            channelBadges = await tApi.chat?.getChannelBadges(streamer.twitchId)
        } catch (error) {
            throw error;
        }

        if (!!channelBadges) {
            await processBadges(channelBadges);
        }
        else {
            throw Error('Could not get channel badges');
        }
    }
    else {
        throw Error('Not enough data to fatch streamer badges');
    }    
}
