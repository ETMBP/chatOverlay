import { Interface } from "readline"
import { ChatMessage, Message } from "../control/chat"
import { ChatUser } from "../control/user"
import { IBackendBadge, IBadge } from "./badge"
import { IBackendEmote, IEmote } from "./emote"
import { IUser } from "./user"

export interface IUserContainerProps {
    user: ChatUser
}

export interface IChatMessageContainerProps {
    containerProps: IChatMessageDTO
}

export interface IIncomingChatMessage {
    user: string,
    message: string,
    flags: any,
    extra: any
}

export interface IChatMessageBadgeDTO {
    name: string,
    version: string
}

export interface IChatMessageMessagePart {
    part: string,
    isUrl: boolean
}

export interface IChatMessageDTO {
    id: string,
    messageLifetime: number,
    user: ChatUser,
    messageParts: Array<IChatMessageMessagePart>
    setMessageQueue: (outgoingMessage: IChatMessageContainerProps, remove: boolean) => void
}

export interface IChatMessage {
    incomingMessage: IIncomingChatMessage,
    messageLifetime: number,
    user?: ChatUser,
    message?: Message,
    extractedEmotes?: Array<IEmote>,
    setMessageQueue: (outgoingMessage: IChatMessageContainerProps, remove: boolean) => void
}

export interface IChatMessageContainerState {
    animationClass: string
}

export interface IMessage {
    rawMessage: string,
    twitchEmotes?: Array<IEmote>,
    resolvedEmotes?: Array<IBackendEmote>,
    emoteRegExp?: RegExp,
    messageParts?: Array<IChatMessageMessagePart>
}

export interface IMessageContainerProps {
    messageParts: Array<IChatMessageMessagePart>
}