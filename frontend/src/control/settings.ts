import { BackendConnection, IBackendError } from "../model/backendConn";

export class DbMaintenanceControl {
    private bc: BackendConnection
    constructor() {
        this.bc = new BackendConnection();
        this.deleteEntity = this.deleteEntity.bind(this)
    }

    public async deleteEntity(type: string): Promise<IBackendError> {
        let endpoint: string = "";

        if (type === 'emote') {
            endpoint = this.bc.system + '/dropemotes';
        }
        else if (type === 'badge') {
            endpoint = this.bc.system + '/dropbadges';
        }
        else if (type === 'user') {
            endpoint = this.bc.system + '/dropusers';
        }
        try {
            if (!!endpoint) {
                const response = await fetch(endpoint);
    
                if (response.ok) {
                    const message = await response.json() as IBackendError;
                    return message;
                }
                else {
                    throw new Error(`${response.status}`)
                }
            }
            else {
                throw new Error(type + " is not a valid entity type to delete") 
            }
        } catch (error) {
            const myError: IBackendError = {
                message: error as string
            };

            return myError
        }
    }
}