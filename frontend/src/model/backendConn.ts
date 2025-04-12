export interface IBackendUrls {
    base: string
    emote: string,
    badge: string,
    user: string
}

export class BackendConn implements IBackendUrls {
    base: string;
    user: string;
    badge: string;
    emote: string;
    
    constructor(){
        this.base = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
        this.user = this.base + '/user';
        this.badge = this.base + '/badge';
        this.emote = this.base + '/emote'
    }
}