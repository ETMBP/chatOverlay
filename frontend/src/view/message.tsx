import React, { JSX } from "react";
import { IMessageContainerProps } from "../model/chat";

export class MessageContainer extends React.Component<IMessageContainerProps> {
    constructor (props: IMessageContainerProps) {
        super(props);
    }

    public render(): React.ReactNode {
        return (
            <div className="msg-container">
                {this.props.messageParts.map((msgPart, i) =>  
                    msgPart.isUrl ? <img src={msgPart.part} alt="emote" className="msg-emote" key={i} /> : <span className="msg-text" key={i}>{msgPart.part}</span>
                )}
            </div>
        );
    }
}