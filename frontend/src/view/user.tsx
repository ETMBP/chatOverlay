import React from "react";
import { IUserContainerProps } from "../model/chat";

export class UserContainer extends React.Component<IUserContainerProps> {
    constructor(props: IUserContainerProps) {
        super(props);
    }

    public isBadges(): boolean {
        if (!!this.props.user.badges && this.props.user.badges.length > 0) {
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
                <img src={this.props.user.pfpUrl} className="pfp-img" alt="pfp"></img>
            </div>
            <div className="username-container">
                <span className="username" style={{color: this.props.user.displayNameColor}}>{this.props.user.displayName}</span>
            </div>
            <div className="badges-container">
                {this.isBadges() ?
                    this.props.user.badges?.map((bu, i) => 
                        <div className="badge" key={i}>
                            <img src={bu.badgeUrl} className="badge-img"></img>
                        </div>
                    ) : <></>
                }
            </div>
        </div>
        )
    }

}