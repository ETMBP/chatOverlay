import { IBadge } from "./badge";

export interface IBackendUser {
    _id?: string,
    updatedWhen: Date
    twitchId?: string,
    pfpUrl?: string,
    username: string
}

export interface IUser {
    username: string;
    displayName: string;
    displayNameColor: string;
    pfpUrl?: string;
    badgeIds?: any
    badges?: IBadge[]
}
