import React, { JSX } from "react";
import { IChatMessageContainerProps, IChatMessageContainerState } from "../model/chat";
import { UserContainer } from "./user";
import { MessageContainer } from "./message";

export class ChatMessageContainer extends React.Component<IChatMessageContainerProps> {
    destroyTimer?: NodeJS.Timeout;

    constructor(props: IChatMessageContainerProps) {
        super(props);
        this.initTimers = this.initTimers.bind(this);
    }

    public componentDidMount(): void {
        this.initTimers();
    }

    public componentWillUnmount(): void {
        clearTimeout(this.destroyTimer);
    }

    private initTimers() {
        if (this.destroyTimer != null){
            clearTimeout(this.destroyTimer)
        }

        this.destroyTimer = setTimeout(() => {
            this.props.containerProps.setMessageQueue(this.props, true);
            clearTimeout(this.destroyTimer);
        }, this.props.containerProps.messageLifetime);
    }

    public render() {
        return (
            <>
            <div className="chat-message-container" >
                <UserContainer user={this.props.containerProps.user}></UserContainer>
                <MessageContainer messageParts={this.props.containerProps.messageParts}></MessageContainer>
            </div>
            </>
        )
    }
}