import { useState } from "react";
import './settings.css'
import React from "react";
import { ISettingsProps, ISettingsState } from "../model/settings";
import { DbMaintenanceControl } from "../control/settings";

export class DbMaintenance extends React.Component<ISettingsProps,ISettingsState> {
    private mt: DbMaintenanceControl;

    constructor(props: ISettingsProps) {
        super(props)
        this.mt = new DbMaintenanceControl();
        this.state = {
            message: "0"
        }

        this.deleteUsers = this.deleteUsers.bind(this)
        this.deleteEmotes = this.deleteEmotes.bind(this);
    }

    public async deleteUsers() {
        this.setState({message: "Working..."})
        this.mt.deleteUsers()
            .then(res => {
                this.setState({message: res.message})
            });
    }

    public async deleteEmotes() {
        this.setState({message: "Working..."})

        this.mt.deleteEmotes()
            .then(res => {
                this.setState({message: res.message})
            });
    }

    public render(): React.ReactNode {
        return (<div id="db-mt-buttons">
            <div className="db-mt-button">
                <button onClick={this.deleteEmotes}>
                    Delete Emotes
                </button>
            </div>
            <div className="db-mt-button">
                <button>
                    Delete Badges
                </button>
            </div>
            <div className="db-mt-button">
                <button onClick={this.deleteUsers}>
                    Delete Users
                </button>
                <div className="user-result-message">
                    <span>{`${this.state.message}`}</span>
                </div>
            </div>
        </div>);
    }
}

function Settings() {
    const [hideButtons, setHideButtons] = useState(true);
    const handleHideButton = () => {
        setHideButtons(!hideButtons)
    }
    return (
        <div id="page">
            <div id="header">
                <div id="page-title">
                    <h1>Backend Maintenance task</h1>
                </div>
            </div>
            <div id="content">
                <div id="db-maintenance">
                    <div id="hide-button-container">
                        <button onClick={handleHideButton} className="hide-button">
                            Toggle Danger Area
                        </button>
                    </div>
                    {hideButtons ? <></> : <DbMaintenance />}
                </div>
            </div>
        </div>
    );
}

export default Settings;