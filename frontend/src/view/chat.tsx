import React, { JSX } from "react";
import { IChatMessageContainerProps, IChatMessageContainerState } from "../model/chat";
import { UserContainer } from "./user";

export class ChatMessageContainer extends React.Component<IChatMessageContainerProps> {
    fadeoutTimer?: NodeJS.Timeout;
    constructor(props: IChatMessageContainerProps) {
        super(props);
    }

    public render() {
        return (
            <li className="chat-message-container">
                <UserContainer chatMessage={this.props.userContainerProps}></UserContainer>
            </li>
        )
    }
}