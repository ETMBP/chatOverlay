import { IBadge } from "../models/badge";
import { ObjectId } from "mongodb";
import { tApi } from "./twitchAuth";
import { HelixChatBadgeSet, HelixChatBadgeVersion } from "@twurple/api";
import collections, { dbConnection } from "./dbConnection";




export class Badge implements IBadge {
    public name: string;
    public badgeUrl?: string | undefined;
    public version: string;
    public _id?: ObjectId | undefined;
    
    constructor (name:string, version:string, url: string) {
        this.name = name;
        this.version = version;
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
                console.debug(this.name + ' v:' + this.version + ' was not found in the DB')
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
        for (let i = 0; i < globalBadges.length; i++) {
            const badge = globalBadges[i] as HelixChatBadgeSet;
            for (let j = 0; j < badge.versions.length; j++) {
                const version = badge.versions[j];
                let url
                try {
                    url = version.getImageUrl(1);
                } catch (error) {
                    throw error
                }

                if (!!url) {
                    const myBadge = new Badge(badge.id, version.id, url);
                    try {
                        await myBadge.commitToDb();
                    } catch (error) {
                        throw error;
                    }
                }
                else {
                    throw Error('Could not get URL for ' + badge.id + ' badge')
                }
            }
        }
    }
    else {
        throw Error('Not enough data to save global badges');
    }
}