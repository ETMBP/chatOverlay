import { StreamerbotClient } from "@streamerbot/client";
import { useState } from "react";

function Events() {
    const [events, setEvents] = useState(new Date());
    const sbClient = new StreamerbotClient({
        host: 'localhost',
        port: 9090,
        immediate: true,
        autoReconnect: true,
        retries: 5,
        onConnect: (info) => console.log('Connected to Streamer.bot', info),
        onError: (error) => console.error('Error:', error),
      });

    sbClient.on('Twitch.*', eventData => {
        console.log('New event: ', eventData);
    })
    return (
        <div id="event-container">
            <span>Event type:</span>
        </div>
    );
}

export default Events;