import React, { JSX } from "react";
import { IChatMessageContainerProps, IChatMessageContainerState } from "../model/chat";
import { UserContainer } from "./user";
import { MessageContainer } from "./message";

export class ChatMessageContainer extends React.Component<IChatMessageContainerProps> {
    fadeOutTimer?: NodeJS.Timeout;
    destroyTimer?: NodeJS.Timeout;

    constructor(props: IChatMessageContainerProps) {
        super(props);
    }

    public componentDidMount(): void {
        this.initTimers();
    }

    public componentWillUnmount(): void {
        clearTimeout(this.fadeOutTimer);
        clearTimeout(this.destroyTimer);
    }

    private initTimers() {
        if (this.fadeOutTimer != null) {
            clearTimeout(this.fadeOutTimer)
        }

        if (this.destroyTimer != null){
            clearTimeout(this.destroyTimer)
        }

        this.fadeOutTimer = setTimeout(() => {
            this.setState({isExpired:true});
            clearTimeout(this.fadeOutTimer);
        }, this.props.containerProps.messageLifetime - 500);
        this.destroyTimer = setTimeout(() => {
            this.props.containerProps.setMessageQueue(this.props, true);
            clearTimeout(this.destroyTimer);
        }, this.props.containerProps.messageLifetime);
    }

    public render() {
        return (
            <>
            <div className="chat-message-container">
                <UserContainer user={this.props.containerProps.user}></UserContainer>
                <MessageContainer messageParts={this.props.containerProps.messageParts}></MessageContainer>
            </div>
            </>
        )
    }
}