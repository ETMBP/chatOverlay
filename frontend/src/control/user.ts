import { json } from 'stream/consumers';
import noPfp from '../content/no_pfp.png'
import { BackendConnection, IBackendError } from '../model/backendConn';
import { IBackendBadge, IBadge } from '../model/badge';
import { IBackendUser, IUser } from '../model/user';
import { BackendError } from '../model/error';

export class ChatUser implements IUser {
    username: string;
    displayName: string;
    displayNameColor: string;
    pfpUrl?: string | undefined;
    badgeIds?: any | undefined;
    badges?: IBadge[] | undefined;

    constructor(username: string, displayName: string, displayNameColor?: string, badgeIds?: any) {
        this.username = username;
        this.displayName = displayName;
        this.displayNameColor = displayNameColor || '#b7b7b7';
        this.badgeIds = badgeIds;
        this.badges = [];
    }

    public async init(): Promise<void> {
       await this.setPfpUrl();
       await this.setBadges();
    }

    public async getPfpUrl(): Promise<string> {
        if (!!this.pfpUrl) {
            return this.pfpUrl;
        }
        else {
            await this.setPfpUrl()
            return this.pfpUrl!
        }
    }

    public async setPfpUrl(): Promise<void> {
        let pfp = new UserPfp(this.username);
        this.pfpUrl = await pfp.getPfpUrl()
    }

    public async setBadges(): Promise<void> {
        const bc = new BackendConnection();
        let resolvedBadges: IBackendBadge[] = []
        if (!!this.badgeIds) {
            for (const [k, v] of Object.entries(this.badgeIds as IBackendBadge)) {
                let badge: IBackendBadge = {
                    name:k,
                    version:v
                }
                resolvedBadges.push(badge);
            }

            try {
                const response = await fetch(bc.badge + '/getmany', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(resolvedBadges)
                });

                if (response.ok) {
                    const badges = await response.json() as IBackendBadge[];
                    badges.map(badge => {
                        if (!!badge.badgeUrl) {
                            this.badges?.push({badgeUrl: badge.badgeUrl} as IBadge);
                        }
                        else {
                            console.error(badge.name + ' came back without URL')
                        }
                    });
                }
                else {
                    const backendError = await response.json();
                    throw new BackendError(backendError.message);
                }
            } 
            catch (error) {
                if (error instanceof BackendError) {
                    console.error('Backend error: ' + error)
                }
                else {
                    console.error(error)
                }
            }
        }
    }
}

export class UserPfp {
    username: string;
    pfpUrl?: string;

    constructor(username: string) {
        this.username = username;
    }

    public async setPfpUrl(): Promise<void> {
        const bc = new BackendConnection();

        try {
            const result = await fetch(bc.user + '/pfp?username=' + this.username);
            if (result.ok) {
                const user = await result.json() as IBackendUser;
                this.pfpUrl = user.pfpUrl;
            }
            else if (!!result.body) {
                const error = await result.json() as IBackendError;
                throw error.message;
            }
            else {
                throw Error('Fetch failed and it did not gave an error');
            }
        } catch (error) {
            console.debug(error);
            console.error('Fetching profile picture failed');
        }
        finally {
            if (!this.pfpUrl) {
                this.pfpUrl = noPfp;
            }
        }
    }

    public async getPfpUrl(): Promise<string> {
        if (!!this.pfpUrl) {
            return this.pfpUrl;
        }
        else {
            await this.setPfpUrl()
            return this.pfpUrl!
        }
    }
}