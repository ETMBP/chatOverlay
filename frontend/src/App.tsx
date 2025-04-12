import React, { useEffect, useState } from 'react';
import './App.css';
import ComfyJS from 'comfy.js';
import { useSearchParams } from 'react-router';
import { connectComfy, initBackend } from './control/init';
import { ChatMessage } from './control/chat';
import { IIncomingChatMessage } from './model/chat';
import { ChatMessageContainer } from './view/chat';



function App() {
  const [messageQueue, setMessageQueue] = useState([] as ChatMessage[]);
  const [searchParams, setSearchParams] = useSearchParams();
  const streamerName = searchParams.get('streamer') || 'zentreya';

  ComfyJS.onChat = async (user: string, message: string, flags: object, self: any, extra: any) => {
    console.debug(`New chat message by ${extra.displayName}`);
    const incomingChatMessage = {
      user: user,
      message: message,
      flags: flags,
      extra: extra
    } as IIncomingChatMessage;

    const myChatMessage = new ChatMessage(incomingChatMessage);
    await myChatMessage.init();

    const updatedMessageQueue = [myChatMessage, ...messageQueue];
    setMessageQueue(updatedMessageQueue);
  }

  useEffect(() => {
    console.debug('sideeffect');
    initBackend(streamerName);
    connectComfy(streamerName);
  }, [streamerName]);

  return (
    <div className="App">
      <ul id='chat-container'>
        {messageQueue.map(cm => <React.Fragment key={cm.incomingMessage.extra.id}>
          <ChatMessageContainer userContainerProps={cm}></ChatMessageContainer>
        </React.Fragment>)}
      </ul>
    </div>
  );
}

export default App;
