import React, { useEffect, useState } from 'react';
import './App.css';
import ComfyJS from 'comfy.js';
import { useSearchParams } from 'react-router';
import { connectComfy, initBackend } from './control/init';
import { ChatMessage } from './control/chat';
import { IChatMessage, IChatMessageDTO, IIncomingChatMessage } from './model/chat';
import { ChatMessageContainer } from './view/chat';

let processedMessageQueue: Array<ChatMessage> = new Array<ChatMessage>();

function App() {
  const [messageQueue, setMessageQueue] = useState([] as ChatMessage[]);
  const [lastMessageProcessed, setLastMessageprocessed] = useState(new Date());
  const [searchParams, setSearchParams] = useSearchParams();
  const streamerName = searchParams.get('streamer') || 'zentreya';
  let incomingMessageQueue: Array<ChatMessage> = new Array<ChatMessage>();

  const addToMessageQueue = (resolvedChatMessage: ChatMessage, remove?: boolean) => {
    if (!remove) {
      processedMessageQueue.splice(0,0,resolvedChatMessage);
      setLastMessageprocessed(new Date());
    }
    else {
      for (let i = 0; i < processedMessageQueue.length; i++) {
        const msg = processedMessageQueue[i];
        if (msg.incomingMessage.extra.id === resolvedChatMessage.incomingMessage.extra.id) {
          processedMessageQueue.splice(i,1);
        }
      }
    }
  }

  const addIncomingMessage = async (incomingChatMessage: IIncomingChatMessage) => {
    const myIncomingChatMessage = new ChatMessage(incomingChatMessage);
    myIncomingChatMessage.setMessageQueue = addToMessageQueue
    myIncomingChatMessage.init();
    //incomingMessageQueue.push(myIncomingChatMessage);
  }

  const removeSelf = (messageID: string) => {
    let newMessageQueue = messageQueue;
    const filteredQueue = newMessageQueue.filter(item => {
      return (messageID !== item.incomingMessage.extra.id) as boolean
    });

    setMessageQueue(filteredQueue);
  }

  ComfyJS.onChat = async (user: string, message: string, flags: object, self: any, extra: any) => {
    console.debug(`New chat message by ${extra.displayName}`);
    const incomingChatMessage = {
      user: user,
      message: message,
      flags: flags,
      extra: extra
    } as IIncomingChatMessage;

    addIncomingMessage(incomingChatMessage);
  }

  useEffect(() => {
    console.debug('sideeffect');
    initBackend(streamerName);
    connectComfy(streamerName);
    if (!processedMessageQueue) {
      processedMessageQueue = new Array<ChatMessage>()
    }
  }, [streamerName]);

  return (
    <div className="App">
      <div id='chat-container'>
        {processedMessageQueue!.map(cm => <React.Fragment key={cm.incomingMessage.extra.id}>
          <ChatMessageContainer containerProps={cm}></ChatMessageContainer>
        </React.Fragment>)}
      </div>
    </div>
  );
}

export default App;
