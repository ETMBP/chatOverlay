import { ObjectId } from "mongodb"

export interface IUser {
    _id?: ObjectId,
    updatedWhen: Date
    twitchId?: string,
    pfpUrl?: string,
    username: string
}

