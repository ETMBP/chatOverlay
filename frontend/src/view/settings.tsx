import { useState } from "react";
import './settings.css'
import React from "react";
import { ISettingsProps, ISettingsState } from "../model/settings";
import { DbMaintenanceControl } from "../control/settings";

export class DbMaintenance extends React.Component<ISettingsProps,ISettingsState> {
    private mt: DbMaintenanceControl;

    constructor(props: ISettingsProps) {
        super(props);
        this.mt = new DbMaintenanceControl();
        this.state = {
            message: "0"
        };

        this.deleteEntity = this.deleteEntity.bind(this);
    }

    public async deleteEntity(type: string) {
        this.setState({ message: "Working..." })

        this.mt.deleteEntity(type)
            .then(res => {
                this.setState({ message: res.message })
            });
    }

    public render(): React.ReactNode {
        return (<div id="db-mt-buttons">
            <div className="db-mt-button">
                <button onClick={() => this.deleteEntity('emote')}>
                    Delete Emotes
                </button>
            </div>
            <div className="db-mt-button">
                <button onClick={() => this.deleteEntity('badge')}>
                    Delete Badges
                </button>
            </div>
            <div className="db-mt-button">
                <button onClick={() => this.deleteEntity('user')}>
                    Delete Users
                </button>
            </div>
            <div className="delete-result-message">
                <span>{this.state.message}</span>
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