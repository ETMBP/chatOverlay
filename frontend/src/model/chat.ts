import { ChatMessage } from "../control/chat"
import { ChatUser } from "../control/user"
import { IBackendBadge, IBadge } from "./badge"
import { IBackendEmote } from "./emote"

export interface IUserContainerProps {
    chatMessage: ChatMessage
}

export interface IChatMessageContainerProps {
    userContainerProps: ChatMessage,
    //messageContainerProps: IMessageContainerProps
}

export interface IIncomingChatMessage {
    user: string,
    message: string,
    flags: any,
    extra: any

}

export interface IChatMessage {
    user?: ChatUser,
    incomingMessage: IIncomingChatMessage,
}

export interface IChatMessageContainerState {
    animationClass: string
}