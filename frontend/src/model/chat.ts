import { IBadge } from "./badge"
import { IEmote } from "./emote"

export interface IPfpContainerProps {
    pfpUrl: string
}

export interface IUserNameContainerProps {
    username: string,
    usernameColor: string
}

export interface IBadgeContainerProps {
    badges?: IBadge[]
}

export interface IMessageContainerProps {
    rawMessage: string
    emotes?: IEmote[]
}


export interface IUserContainerProps {
    pfpContainerProps: IPfpContainerProps,
    usernameContainerProps: IUserNameContainerProps,
    badgeContainerProps: IBadgeContainerProps
}