import { ObjectId } from "mongodb";

export interface  IEmote {
    name: string,
    sourceId?: string,
    emoteUrl?: string
    _id?: ObjectId
}