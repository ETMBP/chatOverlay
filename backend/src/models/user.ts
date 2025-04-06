import { ObjectId } from "mongodb"

export interface IBadge {
    name: string,
    badgeUrl?: string
}

export interface IUser {
    username: string,
    twitchId?: string,
    pfpUrl?: string,
    badges?: IBadge[],
    _id?: ObjectId
}

