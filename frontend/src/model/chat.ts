import { Interface } from "readline"
import { ChatMessage } from "../control/chat"
import { ChatUser } from "../control/user"
import { IBackendBadge, IBadge } from "./badge"
import { IBackendEmote } from "./emote"

export interface IUserContainerProps {
    chatMessage: ChatMessage
}

export interface IChatMessageContainerProps {
    containerProps: ChatMessage,
    //messageContainerProps: IMessageContainerProps
}

export interface IIncomingChatMessage {
    user: string,
    message: string,
    flags: any,
    extra: any
}

export interface IChatMessageEmoteDTO {
    emoteId: string,
    positions: Array<string>
}

export interface IChatMessageBadgeDTO {
    name: string,
    version: string
}

export interface IChatMessageDTO {
    id: string,
    username: string,
    rawMessage: string,
    displayName?: string,
    userColor?: string,
    twitchEmotes?: Array<IChatMessageEmoteDTO>,
    twitchBadges?: Array<IChatMessageBadgeDTO>
}

export interface IChatMessage {
    user?: ChatUser,
    incomingMessage: IIncomingChatMessage,
    setMessageQueue?: (outgoingMessage: ChatMessage, remove: boolean) => void
}

export interface IChatMessageContainerState {
    animationClass: string
}