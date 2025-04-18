import { ObjectId } from "mongodb";

export interface IBadge {
    _id?: ObjectId,
    name: string,
    badgeUrl?: string,
    version: string
}
