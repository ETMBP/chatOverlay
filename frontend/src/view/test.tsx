import React from "react";

class CoCacher {
    public timestamp: Date;
    public validForSeconds: number;

    constructor(validForSeconds: number) {
        this.timestamp = new Date();
        this.validForSeconds = validForSeconds;
    }

    /**
     * IsExpired
     */
    public IsExpired() {
        
    }
}
function Tests() {
    return (
        <div id="test-frame">

        </div>
    )
}

export default Tests;