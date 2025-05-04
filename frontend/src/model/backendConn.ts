export interface IBackendUrls {
    base: string
    emote: string,
    badge: string,
    user: string
}

export class BackendConnection implements IBackendUrls {
    base: string;
    user: string;
    badge: string;
    emote: string;
    
    constructor(){
        const regExp = new RegExp('(http://(.*).[a-z]+)')
        const backendUrl = ((window.location.href).match(regExp))
        if (!!backendUrl /*&& (!(window.location.href).match('localhost'))*/) {
            let splitUrl = backendUrl[0].split('.')
            splitUrl[0] = splitUrl[0] + '-backend'
            this.base = splitUrl.join('.')
        }
        else {
            this.base = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
        }
        this.user = this.base + '/user';
        this.badge = this.base + '/badge';
        this.emote = this.base + '/emote'
        console.debug('Backend base URL: ' + this.base)
    }
}

export interface IBackendError {
    message: string;
}