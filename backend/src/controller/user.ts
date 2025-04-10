import { HelixUser } from "@twurple/api";
import { IUser } from "../models/user"
import collections from "./dbConnection";
import { tApi } from "./twitchAuth";
import { addMinutes } from "date-fns"

export class User implements IUser {
    username: string;
    pfpUrl?: string | undefined;
    twitchId?: string | undefined;
    updatedWhen: Date;
    lifetime: number;

    constructor(username: string, lifetime?: number) {
        this.username = username;
        this.updatedWhen = new Date();
        this.lifetime = this.setLifetime(lifetime);
    }

    private setLifetime(lifetime: number | undefined): number {
        if (!!lifetime && typeof lifetime === 'number') {
            return lifetime
        }
        else if (!lifetime && !!process.env.USER_LIFETIME && typeof process.env.USER_LIFETIME === 'number') {
            return process.env.USER_LIFETIME
        }
        else {
            return 30
        }
    }

    private async getTwitchUserId(): Promise<HelixUser | void> {
        let twitchUser;

        try {
            twitchUser = await tApi.user?.getUserByName(this.username);
        } catch (error) {
            throw (error);
        }

        if (!!twitchUser && twitchUser instanceof HelixUser) {
            return twitchUser
        }
        else {
            throw Error('No data from TwitchAPI, maybe user does not exist');
        }
    }

    public async setTwitchId() {
        const dbConn = collections.users

        if (!!dbConn) {
            const currentTime = new Date();
            let searchResult
            const searchQuery = {
                username: this.username
            }

            try {
                searchResult = await dbConn.findOne(searchQuery) as IUser;
            } catch (error) {
                console.error('User lookup failed', error);
            }


            if (!!searchResult && currentTime < addMinutes(searchResult.updatedWhen, this.lifetime)) {
                console.debug(this.username + ' was found in the DB');
                this.twitchId = searchResult.twitchId;
            }
            else if (!!searchResult && currentTime > addMinutes(searchResult.updatedWhen, this.lifetime)) {
                console.debug(this.username + ' was found in the DB but data has expired');
                let twitchUser: HelixUser | void

                try {
                    twitchUser = await this.getTwitchUserId();
                } catch (error) {
                    throw error
                }

                if (!!twitchUser) {
                    this.updatedWhen = currentTime;
                    let updateQuery = {
                        $set: {
                            twitchId: twitchUser.id,
                            updatedWhen: currentTime
                        }
                    };

                    this.twitchId = twitchUser.id
                    try {
                        dbConn.updateOne(searchQuery, updateQuery);
                    } catch (error) {
                        throw Error('Could not update user in the DB ' + error);
                    }
                }
                else {
                    throw Error('Returned HelixUser is invalid or empty, could not set user ID')
                }
            }
            else {
                console.debug('User was not found in the DB');
                let twitchUser = await this.getTwitchUserId();

                if (!!twitchUser && twitchUser instanceof HelixUser) {
                    this.twitchId = twitchUser.id;
                    try {
                        dbConn.insertOne(this as IUser)
                    } catch (error) {
                        console.error('Failed to add user to the DB ', error)
                    }
                }
                else {
                    const message = 'Unexpected API response while getting user by username'
                    console.error(message);
                    throw Error(message)
                }
            }
        }
        else {
            throw Error('No DB connection, user lookup failed');
        }
    }

    public async setPfpUrl():Promise<void> {
        const currentTime = new Date();
        let searchResult;
        const dbConn = collections.users;
        const searchQuery = {
            username: this.username
        };

        if (!!dbConn) {
            try {
                searchResult = await dbConn.findOne(searchQuery) as IUser;
            } catch (error) {
                throw error;
            }

            if (!!searchResult && !!searchResult.twitchId && (currentTime > addMinutes(searchResult.updatedWhen, this.lifetime) || !searchResult.pfpUrl)) {
                console.debug(this.username + ' was found in the DB but the data has expired');
                let twitchUser: HelixUser | undefined | null;
                try {
                    twitchUser = await tApi.user?.getUserByName(this.username);
                    if (!!twitchUser && twitchUser instanceof HelixUser) {
                        this.twitchId = twitchUser.id;
                        this.pfpUrl = twitchUser.profilePictureUrl;
                    }
                    else {
                        throw Error('Unexpected API response while getting user by username');
                    }
                }
                catch (error) {
                    throw error;
                }

                if (!!this.twitchId && !!this.pfpUrl) {
                    const updateQuery = {
                        $set: {
                            twitchId: this.twitchId,
                            pfpUrl: this.pfpUrl
                        }
                    }

                    try {
                        const dbResult = await dbConn.updateOne(searchQuery,updateQuery)
                    } catch (error) {
                        throw error
                    }
                }
                else {
                    throw Error('Not enough data to update DB');
                }
            }
            else if (!!searchResult && !!searchResult.pfpUrl) {
                console.debug(this.username + ' was found in the DB');
                this.twitchId = searchResult.twitchId
                this.pfpUrl = searchResult.pfpUrl;
            }
            else {
                console.debug(this.username + ' was not found in the DB');
                let twitchUser: HelixUser | undefined | null
                try {
                    twitchUser = await tApi.user?.getUserByName(this.username);
                } catch (error) {
                    throw error;
                }

                if (!!twitchUser && twitchUser instanceof HelixUser) {
                    this.twitchId = twitchUser.id;
                    this.pfpUrl = twitchUser.profilePictureUrl;

                    try {
                        const dbResponse = await dbConn.insertOne(this);
                    } catch (error) {
                        throw error;
                    }
                }
                else {
                    throw Error('Not enough data to create ' + this.username + ' in the DB')
                }

            }
        }
        else {
            throw Error('No DB connection, user lookup failed');
        }
    }
}