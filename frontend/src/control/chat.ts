import { IChatMessage, IIncomingChatMessage } from "../model/chat";
import { ChatUser } from "./user";

export class ChatMessage implements IChatMessage{
    incomingMessage: IIncomingChatMessage;
    user?: ChatUser | undefined;
    constructor(incomingMessage: IIncomingChatMessage) {
        this.incomingMessage = incomingMessage;
    }

    public async init() {
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

        await this.user.init();
    }
}