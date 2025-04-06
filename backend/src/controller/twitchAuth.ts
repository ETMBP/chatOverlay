import { AppTokenAuthProvider } from "@twurple/auth";
import { ApiClient, HelixChatApi, HelixUserApi } from '@twurple/api';

export class TwitchAPI {
    private authProvider?: AppTokenAuthProvider;
    public apiConnection?: ApiClient;

    constructor(clientID: string, clientSecret: string) {
        this.authProvider = new AppTokenAuthProvider(clientID, clientSecret);
        this.apiConnection = this.setApiConnection(this.authProvider);
    }

    private setApiConnection(authProvider: AppTokenAuthProvider): ApiClient {
        return new ApiClient({ authProvider });
    }

    public getUserConnection():HelixUserApi | void {
        try {
            const userApi = this.apiConnection?.users;
            if (!!userApi) {
                return userApi;
            }
            else {
                throw Error('Could not create Twitch API connection in user context');
            }
        } catch (error) {
            console.error(error);
        }
    }

    public getChatConnection():HelixChatApi | void {
        try {
            const chatApi = this.apiConnection?.chat;
            if (!!chatApi) {
                return chatApi
            }
            else {
                throw Error('Could not create Twitch API connection in chat context')
            }
        } catch (error) {
            console.error(error)
        }
    }
}

export const tApi: {
    user?: HelixUserApi,
    chat?: HelixChatApi
} = {}

export function twitchApiConnection(): void {
    const id = process.env.CLIENT_ID;
    const secret = process.env.CLIENT_SECRET;
    if (!!id && !!secret) {
        const myTwitchApi =  new TwitchAPI(id, secret);
        const userApi = myTwitchApi.getUserConnection();
        const chatApi = myTwitchApi.getChatConnection();

        if (!!userApi && !!chatApi) {
            tApi.user = userApi;
            tApi.chat = chatApi;
            console.log('Connecting to Twitch API was successfull')
        }
        else {
            throw Error('Failed to create Twitch API connections')
        }
    }
    else {
        throw Error('Not enough data to create Twitch API connections. Please make sure env variables are available');
    }
}