import React, { JSX } from "react";
import { IMessageContainerProps } from "../model/chat";

export class MessageContainer extends React.Component<IMessageContainerProps> {
    constructor (props: IMessageContainerProps) {
        super(props);
    }

    public render(): React.ReactNode {
        return (
            <div className="msg-container">
                {this.props.messageParts.map(msgPart => 
                    msgPart.isUrl ? <img src={msgPart.part} alt="emote" className="msg-emote" key={crypto.randomUUID()} /> : <span className="msg-text" key={crypto.randomUUID()}>{msgPart.part}</span>
                )}
            </div>
        );
    }
}