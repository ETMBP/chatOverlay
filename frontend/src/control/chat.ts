import { BackendConnection } from "../model/backendConn";
import { IChatMessage, IChatMessageBadgeDTO, IChatMessageContainerProps, IChatMessageDTO, IChatMessageMessagePart, IIncomingChatMessage, IMessage } from "../model/chat";
import { IBackendEmote, IEmote } from "../model/emote";
import { BackendError } from "../model/error";
import { ChatUser } from "./user";

export class ChatMessage implements IChatMessage{
    incomingMessage: IIncomingChatMessage;
    messageLifetime: number;
    user?: ChatUser | undefined;
    extractedEmotes?: Array<IEmote>;
    message?: Message;
    setMessageQueue: (outgoingMessage: IChatMessageContainerProps, remove?: boolean) => void = () => {};

    constructor(incomingMessage: IIncomingChatMessage, messageLifetime: number) {
        this.incomingMessage = incomingMessage;
        this.messageLifetime = messageLifetime;
        this.getChatMessageContainerProps.bind(this);
        this.setMessageQueue.bind(this);
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

        if (!!this.incomingMessage.extra.messageEmotes) {
            this.extractedEmotes = this.extractTwitchEmotes();
            this.message = new Message(this.incomingMessage.message, this.extractedEmotes);
        }
        else {
            this.message = new Message(this.incomingMessage.message);
        }

        Promise.all([
            this.user.init(),
            this.message.init()
        ])
            .then(res => {
                const props = this.getChatMessageContainerProps()
                this.setMessageQueue(props)
            })
            .catch(error => (console.error(error)))

        /*setTimeout(() => {
            this.setMessageQueue(this, true)
        }, 3000);*/
    }
    
    public extractTwitchEmotes(): Array<IEmote> | undefined {
        if (!!this.incomingMessage.extra.messageEmotes) {
            let processedTwitchEmotes: Array<IEmote> = new Array<IEmote>();
    
            for (const [k, v] of Object.entries(this.incomingMessage.extra.messageEmotes as IEmote)) {
                const emote: IEmote = {
                    emoteId:k,
                    positions:v
                }
                processedTwitchEmotes.push(emote);
            }
    
            return processedTwitchEmotes
        }
        else {
            console.debug('Message has no twitch emotes');
            return undefined;
        }
    }

    public getChatMessageContainerProps(): IChatMessageContainerProps {
        const myContainerProps: IChatMessageDTO = {
            id: this.incomingMessage.extra.id,
            messageLifetime: this.messageLifetime,
            user: this.user!,
            messageParts: this.message?.messageParts!,
            setMessageQueue: this.setMessageQueue
        }

        return {
            containerProps: myContainerProps 
        } as IChatMessageContainerProps
    }
}

export class Message implements IMessage{
    rawMessage: string;
    twitchEmotes?: Array<IEmote> | undefined;
    resolvedEmotes?: Array<IBackendEmote> | undefined;
    emoteRegExp?: RegExp;
    messageParts?: Array<IChatMessageMessagePart> | undefined;
    
    constructor(rawMessgae: string, twitchEmotes?: Array<IEmote>) {
        this.rawMessage = rawMessgae;
        this.twitchEmotes = twitchEmotes;
        this.setMessageParts.bind(this);
    }

    public async init(): Promise<void> {
        await Promise.all([
            this.resolveTwitchEmotes(),
            this.setRegexp()
        ]).then(res => this.setMessageParts())
    }

    private async setRegexp(): Promise<void> {
        const bc = new BackendConnection();
        let allNames: string[] = [];
        const reSpecialChars = /[\!\?\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g;
          
        try {
            const response = await fetch(bc.emote + '/getallnames');
            if (response.ok) {
                allNames = await response.json();
            }
            else {
                const backendError = await response.json();
                throw new BackendError(backendError.message);
            }
        } 
        catch (error) {
            if (error instanceof BackendError) {
                console.error('Backend error: ' + error)
            }
            else {
                console.error(error)
            }
        }

        if (!!allNames && allNames.length > 0) {
            var sTvString = '('

            for (let i = 0; i < allNames.length; i++) {
              const name = allNames[i];
              const escapedName = name.replace(reSpecialChars, '\\$&');
              if (i !== 0) {
                sTvString = sTvString + '|\\b' + escapedName + '\\b';
              }
              else {
                sTvString = sTvString + '\\b' + escapedName + '\\b';
              }
            }
            let allEmoteNames = sTvString + ')'

            this.emoteRegExp = new RegExp(allEmoteNames, 'g');
        }
    }

    private getEmoteName(emote: IEmote, message: string): string {
        const position = emote.positions[0];
        const positions = position.split('-');
        const startingPosition = Number(positions[0]);
        const endingPosition = Number(positions[1]) + 1;

        return message.substring(startingPosition,endingPosition);
    }

    public async resolveTwitchEmotes(): Promise<void> {
        let emotesToResolve: Array<IBackendEmote> = new Array<IBackendEmote>

        if (!!this.twitchEmotes) {
            for (let i = 0; i < this.twitchEmotes.length; i++) {
                const emote = this.twitchEmotes[i] as IEmote;
                const myEmote: IBackendEmote = {
                    name: this.getEmoteName(emote, this.rawMessage),
                    sourceId: emote.emoteId
                }
                emotesToResolve.push(myEmote);
            }

            try {
                const bc = new BackendConnection();

                const response = await fetch(bc.emote + '/getmany', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(emotesToResolve)
                });

                if (response.ok) {
                    this.resolvedEmotes = await response.json();
                }
                else {
                    const backendError = await response.json();
                    throw new BackendError(backendError.message);
                }
            } 
            catch (error) {
                if (error instanceof BackendError) {
                    console.error('Backend error: ' + error)
                }
                else {
                    console.error(error)
                }
            }            
        }
        
        await this.setRegexp()
    }

    public async setMessageParts(): Promise<void> {
        let emotesToResolve: IBackendEmote[] | null = null
        let matches: RegExpMatchArray | null = null
        try {
            if (!!this.emoteRegExp) {
                matches = this.rawMessage.match(this.emoteRegExp);

                if (!!matches && matches.length > 0) {
                    emotesToResolve = new Array<IBackendEmote>;
                    for (let i = 0; i < matches.length; i++) {
                        const emote = matches[i];
                        const myBackendEmote = {
                            name: emote
                        }
                        emotesToResolve.push(myBackendEmote)
                    }
                }
            }
        } catch (error) {
            console.debug(error);
            console.error('RegExp failed to match message');
        }

        if (!!emotesToResolve && emotesToResolve.length > 0) {
            try {
                const bc = new BackendConnection();
    
                const response = await fetch(bc.emote + '/getmany', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(emotesToResolve)
                });
    
                if (response.ok) {
                    this.resolvedEmotes = await response.json();
                }
                else {
                    const backendError = await response.json();
                    throw new BackendError(backendError.message);
                }
            } 
            catch (error) {
                if (error instanceof BackendError) {
                    console.error('Backend error: ' + error)
                }
                else {
                    console.error(error)
                }
            }
        }
        else {
            console.debug('No emotes to resolve')
        }

        if (!!this.resolvedEmotes && this.resolvedEmotes.length > 0 && matches !== null) {
            let messageParts: Array<IChatMessageMessagePart> = new Array<IChatMessageMessagePart>;
            let rawPart: string = "";
            let wasRaw: boolean = false
            const whiteSpaceRegex = new RegExp('\\s');
            const splitMessage = this.rawMessage.split(whiteSpaceRegex);
            for (let i = 0; i < splitMessage.length; i++) {
                const word = splitMessage[i];
                if (matches.includes(word)) {
                    if (wasRaw) {
                        messageParts.push({
                            part: rawPart + ' ',
                            isUrl: false
                        });
                        rawPart = "";
                        wasRaw = false;
                    }

                    const myEmote = this.resolvedEmotes.find(emote => {
                        return emote.name === word
                    });
                    messageParts.push({
                        part: myEmote!.emoteUrl!,
                        isUrl: true
                    });
                }
                else {
                    rawPart = rawPart + ' ' + word;
                    wasRaw = true;
                }
            }

            if (!!rawPart && rawPart.length > 0) {
                messageParts.push({
                    part: rawPart + ' ',
                    isUrl: false
                });
            }

            this.messageParts = messageParts
            console.debug('emote replacement ran')
        }
        else {
            this.messageParts =  new Array<IChatMessageMessagePart>({
                part: this.rawMessage,
                isUrl: false
            });
            console.debug('Message went through')
        }
    }
}
