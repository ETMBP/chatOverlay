import { HelixUser } from "@twurple/api";
import { IBadge, IUser } from "../models/user"
import collections from "./dbConnection";
import { tApi } from "./twitchAuth";

export class User implements IUser {
    username: string;
    pfpUrl?: string | undefined;
    badges?: IBadge[] | undefined;
    twitchId?: string | undefined;

    constructor(username: string) {
        this.username = username;
    }

    public async setTwitchId() {
        const dbConn = collections.users

        if (!!dbConn) {
            let searchResult
            const searchQuery = {
                username: this.username
            }

            try {
                searchResult = await dbConn.findOne(searchQuery) as IUser;
            } catch (error) {
                console.error('User lookup failed', error);
            }

            if (!!searchResult) {
                console.debug('User was found in the DB');
                this.twitchId = searchResult.twitchId;
            }
            else {
                console.debug('User was not found in the DB');
                let twitchUser;

                try {
                    twitchUser = await tApi.user?.getUserByName(this.username);
                } catch (error) {
                    console.error(error);
                }

                if (!!twitchUser && twitchUser instanceof HelixUser) {
                    this.twitchId = twitchUser.id;
                    try {
                        dbConn.insertOne(this as IUser)
                    } catch (error) {
                        console.error('Failed to add user to the DB', error)
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
}