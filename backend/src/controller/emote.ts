import { IEmote } from "../models/emote.js";
import { ObjectId } from "mongodb";
import { tApi } from "./twitchAuth.js";
import collections from "./dbConnection.js";
import { HelixChannelEmote, HelixEmote } from "@twurple/api";
import { User } from "./user.js";

export class Emote implements IEmote {
    name: string;
    sourceId?: string | undefined;
    emoteUrl?: string | undefined;
    _id?: ObjectId | undefined;

    constructor(name: string, sourceId?: string, emoteUrl?: string) {
        this.name = name;
        this.sourceId = sourceId;
        this.emoteUrl = emoteUrl;
    }

    public async commitToDb(): Promise<void> {
        const dbConn = collections.emotes;

        if (!!dbConn) {
            const searchQuery = {
                name: this.name
            };
            let searchResult: IEmote | undefined;
            try {
                searchResult = await dbConn.findOne(searchQuery) as IEmote;
            } catch (error) {
                throw error;
            }

            if (!!searchResult && searchResult.emoteUrl !== this.emoteUrl) {
                console.debug(this.name + ' emote was found in the DB, updating');

                const updateQuery = {
                    $set: {
                        emoteUrl: this.emoteUrl
                    }
                };

                try {
                    const dbResult = await dbConn.updateOne(searchQuery, updateQuery);
                } catch (error) {
                    throw error;
                }
            }
            else if (!!searchResult && searchResult.emoteUrl === this.emoteUrl) {
                console.debug(this.name + ' emote was found in the DB');
            }
            else {
                console.debug(this.name + ' emote was not found in the DB');
                try {
                    const dbResult = await dbConn.insertOne(this);
                } catch (error) {
                    throw error;
                }
            }
        }
        else {
            throw Error('No DB connection')
        }
    }

    public async setEmoteUrl(): Promise<void> {
        const dbConn = collections.emotes;
        
        if (!!dbConn) {
            const searchQuery = {
                name: this.name
            };
            let dbResult: IEmote;

            try {
                dbResult = await dbConn.findOne(searchQuery) as IEmote;
            } catch (error) {
                throw error;
            }

            if (!!dbResult && !!dbResult.emoteUrl && (dbResult.emoteUrl === this.emoteUrl || this.emoteUrl === undefined)) {
                console.debug(this.name + ' emote was found in the DB');
                this.emoteUrl = dbResult.emoteUrl
            }
            else if (!!dbResult && !!dbResult.emoteUrl && !!this.emoteUrl && dbResult.emoteUrl !== this.emoteUrl) {
                await this.commitToDb();
            }
            else {
                let emoteUrl: string | void | undefined;

                if (this.emoteUrl === undefined) {
                    try {
                        emoteUrl = await this.constructTwitchEmoteUrl();
                    } catch (error) {
                        throw error;
                    }
                }

                let isEmoteUrlOk = false

                if (!!emoteUrl) {
                    this.emoteUrl = emoteUrl;
                    isEmoteUrlOk = true;
                }
                else if (!!this.emoteUrl) {
                    isEmoteUrlOk = true;
                }
                else {
                    throw Error('Not enough data to save the emote ' + this.name);
                }

                if (isEmoteUrlOk) {
                    try {
                        this.commitToDb();
                    } catch (error) {
                        throw error;
                    }
                }
            }
        }
        else {
            throw Error('No DB connection');
        }
    }

    public async constructTwitchEmoteUrl(): Promise<string | void> {
        if (!!this.sourceId) {
            const baseUrl = "https://static-cdn.jtvnw.net/emoticons/v2/";
            const emoteUrl = baseUrl + this.sourceId + '/default/dark/1.0';

            try {
                const response = await fetch(emoteUrl);

                if (response.ok) {
                    return emoteUrl;
                }
                else {
                    throw Error('Constructed url failed for emote ' + this.name);
                }
            } catch (error) {
                throw error;
            }
        }
        else {
            throw Error('Not enough data to resolve ' + this.name + ' emote');
        }
    }
}

export async function fetchTwitchGlobalEmotes(): Promise<void> {
    let globalEmotes: HelixEmote[] | undefined;

    try {
        globalEmotes = await tApi.chat?.getGlobalEmotes();
    } catch (error) {
        throw error;
    }
    if (!!globalEmotes && globalEmotes.length > 0) {
        for (let i = 0; i < globalEmotes.length; i++) {
            const emote = globalEmotes[i];
            try {
                const myEmote = new Emote(emote.name, emote.id);
                await myEmote.setEmoteUrl();
            } catch (error) {
                throw error;
            }
        }
    }
}

export async function fetchTwitchChannelEmotes(username: string): Promise<void> {
    let channelEmotes: HelixChannelEmote[] | undefined
    let myUser: User;

    try {
        myUser = new User(username);
        await myUser.setTwitchId();
    } catch (error) {
        throw error;
    }

    if (!!myUser && !!myUser.twitchId) {
        try {
            channelEmotes = await tApi.chat?.getChannelEmotes(myUser.twitchId);
        } catch (error) {
            throw error;
        }
    }
    else {
        throw Error('Not enough data to fetch channel emotes');
    }

    if (!!channelEmotes && channelEmotes.length > 0) {
        for (let i = 0; i < channelEmotes.length; i++) {
            const emote = channelEmotes[i];
            try {
                const myEmote = new Emote(emote.name, emote.id);
                await myEmote.setEmoteUrl();
            } catch (error) {
                throw error;
            }
        }
    }
    else {
        console.warn('Channel emotes came back empty');
    }
}

export async function fetchSTvEmotes(username: string): Promise<void> {
    let sTvemotes: Emote[] | undefined;
    let myUser: User;

    try {
        myUser = new User(username);
        await myUser.setTwitchId();
    } catch (error) {
        throw error;
    }

    if (!!myUser && !!myUser.twitchId) {
        const baseUrl = 'https://7tv.io/v3/';
        const userUrl = baseUrl + 'users/twitch/' + myUser.twitchId;
        const userResponse = await fetch(userUrl);
        const sTvUser = await userResponse.json();
    
        if (undefined !== sTvUser && undefined !== sTvUser.emote_set && undefined !== sTvUser.emote_set.emotes) {
            for (let i = 0; i < sTvUser.emote_set.emotes.length; i++) {
                const emote = sTvUser.emote_set.emotes[i];
    
                if (!!emote.id && !!emote.name && !!emote.data && !!emote.data.host && !!emote.data.host.url && !!emote.data.host.files) {
                    const emoteUrl = 'https:' + emote.data.host.url + '/' + emote.data.host.files[0].name;
                    const myEmote = new Emote(emote.name, emote.id, emoteUrl);
    
                    if (!!myEmote) {
                        try {
                            myEmote.setEmoteUrl();
                        } catch (error) {
                            throw error;
                        }
                    }
                }
            }
        }
    }
    else {
        throw Error('Not enough data to fetch 7TV emotes');
    }
}

export async function getAllNames(): Promise<string[] | void> {
    const dbConn = collections.emotes
    const searchProjection = {
        name: true
    }
    let names: string[] | undefined;

    try {
        const result = await dbConn?.find({}).project(searchProjection).toArray();
        if (!!result && result.length > 0) {
            names = result.map(emote => {
                if (!!emote.name) {
                    return emote.name
                }
            });
        }
    } catch (error) {
        throw error;
    }

    if (!!names && names.length > 0) {
        return names;
    }
}