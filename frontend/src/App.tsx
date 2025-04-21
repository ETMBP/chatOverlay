import React, { useEffect, useState } from 'react';
import './App.css';
import ComfyJS from 'comfy.js';
import { useSearchParams } from 'react-router';
import { connectComfy, initBackend } from './control/init';
import { ChatMessage } from './control/chat';
import { IChatMessage, IChatMessageBadgeDTO, IChatMessageContainerProps, IChatMessageDTO, IIncomingChatMessage } from './model/chat';
import { ChatMessageContainer } from './view/chat';
import { AnimatePresence, motion } from 'framer-motion';

let processedMessageQueue: Array<IChatMessageContainerProps> = new Array<IChatMessageContainerProps>();

function App() {
  const [lastMessageProcessed, setLastMessageprocessed] = useState(new Date());
  const [searchParams, setSearchParams] = useSearchParams();
  const streamerName = searchParams.get('streamer') || 'zelixplore';
  const messageDisplayTimeout = searchParams.get('msg-timeout');

  const setProcessedMessageQueue = (resolvedChatMessage: IChatMessageContainerProps, remove?: boolean) => {
    if (!remove) {
      processedMessageQueue.splice(0,0,resolvedChatMessage);
      setLastMessageprocessed(new Date());
    }
    else {
      for (let i = 0; i < processedMessageQueue.length; i++) {
        const msg = processedMessageQueue[i];
        if (msg.containerProps.id === resolvedChatMessage.containerProps.id) {
          processedMessageQueue.splice(i,1);
        }
      }
      
      setLastMessageprocessed(new Date());
    }
  }

  const addIncomingMessage = async (incomingChatMessage: IIncomingChatMessage) => {
    let msgLifetime: number;
    if (!!messageDisplayTimeout) {
      msgLifetime = parseInt(messageDisplayTimeout)
    }
    else if (!!process.env.REACT_MESSAGE_LIFETIME) {
      msgLifetime = parseInt(process.env.REACT_MESSAGE_LIFETIME) 
    }
    else {
      msgLifetime = 15000
    }
    
    const myIncomingChatMessage = new ChatMessage(incomingChatMessage, msgLifetime);
    myIncomingChatMessage.setMessageQueue = setProcessedMessageQueue
    myIncomingChatMessage.init();
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
      processedMessageQueue = new Array<IChatMessageContainerProps>()
    }
  }, [streamerName]);

  return (
    <div className="App">
      <div id='chat-container'>
        <AnimatePresence mode='popLayout'>
          {processedMessageQueue!.map(cm => <motion.div key={cm.containerProps.id}
            layout
            initial={{ opacity: 0, x: -400, scale: 0.5 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 200, scale: 1.2 }}
            transition={{ duration: 0.6, type: "spring" }}>
            <ChatMessageContainer containerProps={cm.containerProps}></ChatMessageContainer>
          </motion.div>)}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
