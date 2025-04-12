import React, { useEffect, useState } from 'react';
import './App.css';
import ComfyJS from 'comfy.js';
import { useSearchParams } from 'react-router';
import { BackendConn } from './model/backendConn';

function connectComfy(streamerName: string): void {
  const comfyClient = ComfyJS.GetClient();
  if (comfyClient === null) {
    try {
      ComfyJS.Init(streamerName);
      console.debug('Created new comfy instance');
    } catch (error) {
      console.error(error);
    }
  }
  else {
    console.debug('Comfy instance already exists');
  }
}

function initBackend(username: string) {
  const bc = new BackendConn();
  Promise.all([
    fetch(bc.badge + '/fetchall?username=' + username),
    fetch(bc.emote + '/fetchall?username=' + username)
  ])
    .then(res => {
      console.log('Initializing backend was successful');
    })
    .catch(error => {
      throw error;
    })
}

function App() {
  const [messageQueue, setMessageQueue] = useState([] as string [])
  const [searchParams, setSearchParams] = useSearchParams();
  const streamerName = searchParams.get('streamer') || 'zentreya';

  useEffect(() => {
    console.debug('sideeffect');
    connectComfy(streamerName);
    ComfyJS.onChat = async (user: string, message: string, flags: object, self: any, extra: any) => {
      console.debug(`New chat message by ${extra.displayName}`);
    }
  }, []);

  return (
    <div className="App">
      <ul>
        {messageQueue.map(msg => (<li key={msg}>{msg}</li>))}
      </ul>
    </div>
  );
}

export default App;
