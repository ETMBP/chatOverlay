import React from "react";
import { IUserContainerProps } from "../model/chat";

export class UserContainer extends React.Component<IUserContainerProps> {
    constructor(props: IUserContainerProps) {
        super(props);
    }

    public isBadges(): boolean {
        if (!!this.props.chatMessage.user?.badges && this.props.chatMessage.user.badges.length > 0) {
            return true
        }
        else {
            return false
        }
    }

    public render(): React.ReactNode {
        return (
        <div className="user-container">
            <div className="pfp-container">
                <img src={this.props.chatMessage.user?.pfpUrl} className="pfp-img"></img>
            </div>
            <div className="username-container">
                <span className="username" style={{color: this.props.chatMessage.user?.displayNameColor}}>{this.props.chatMessage.user?.displayName}</span>
            </div>
            <div className="badges-container">
                {this.isBadges() ?
                    this.props.chatMessage.user?.badges?.map(bu => 
                        <div className="badge" key={crypto.randomUUID()}>
                            <img src={bu.badgeUrl} className="badge-img"></img>
                        </div>
                    ) : <></>
                }
            </div>
        </div>
        )
    }

}