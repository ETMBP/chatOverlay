import { IChatMessage, IChatMessageBadgeDTO, IChatMessageEmoteDTO, IIncomingChatMessage } from "../model/chat";
import { ChatUser } from "./user";

export class ChatMessage implements IChatMessage{
    incomingMessage: IIncomingChatMessage;
    user?: ChatUser | undefined;
    setMessageQueue: (outgoingMessage: ChatMessage, remove?: boolean) => void = () => {};

    constructor(incomingMessage: IIncomingChatMessage) {
        this.incomingMessage = incomingMessage;
        //this.setMessageQueue = this.setMessageQueue.bind(this);
    }

    public init() {
        if (!!this.incomingMessage.extra.displayName) {
            this.user = new ChatUser(this.incomingMessage.user, this.incomingMessage.extra.displayName)
        }
        else {
            this.user = new ChatUser(this.incomingMessage.user, this.incomingMessage.user)
        }

        if (!!this.incomingMessage.extra.userBadges) {
            this.user.badgeIds = this.incomingMessage.extra.userBadges
        }

        if (!!this.incomingMessage.extra.userColor) {
            this.user.displayNameColor = this.incomingMessage.extra.userColor;
        }

        Promise.all([this.user.init()])
            .then(res => this.setMessageQueue(this))
            .catch(error => (console.error(error)))

        setTimeout(() => {
            this.setMessageQueue(this, true)
        }, 3000);
        
    }
}

export function processTwitchEmotes(rawEmotes?: any): Array<IChatMessageEmoteDTO> | void {
    if (!!rawEmotes) {
        let processedTwitchEmotes: Array<IChatMessageEmoteDTO> = new Array<IChatMessageEmoteDTO>();

        for (const [k, v] of Object.entries(rawEmotes as IChatMessageEmoteDTO)) {
            const emote: IChatMessageEmoteDTO = {
                emoteId:k,
                positions:v
            }
            processedTwitchEmotes.push(emote);
        }

        return processedTwitchEmotes
    }
    else {
        console.debug('Message has no twitch emotes');
    }
}

export function processTwitchBadges(rawbadges?: any): Array<IChatMessageBadgeDTO> | void {
    
}