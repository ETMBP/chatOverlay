import { HelixChatBadgeVersion } from "@twurple/api/lib/endpoints/chat/HelixChatBadgeVersion";
import { ObjectId } from "mongodb";

export interface IBadge {
    _id?: ObjectId,
    name: string,
    badgeUrl?: string,
    version: string
}
