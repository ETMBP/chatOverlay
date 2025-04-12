import ComfyJS from "comfy.js";
import { BackendConnection } from "../model/backendConn";

export function connectComfy(streamerName: string): void {
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
  
  export function initBackend(username: string) {
    const bc = new BackendConnection();
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