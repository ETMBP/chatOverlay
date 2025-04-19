
export interface  IBackendEmote {
    name: string,
    sourceId?: string,
    emoteUrl?: string
    _id?: string
}

export interface IEmote {
    emoteId: string,
    positions: Array<string>
}