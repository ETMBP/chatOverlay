import { BackendConnection, IBackendError } from "../model/backendConn";

export class DbMaintenanceControl {
    private bc: BackendConnection
    constructor() {
        this.bc = new BackendConnection();
        this.deleteUsers = this.deleteUsers.bind(this)
    }

    public async deleteUsers(): Promise<IBackendError> {
        const endpoint = this.bc.system + '/dropusers';

        try {
            const response = await fetch(endpoint);
            let message: IBackendError = {message: ""};
            
            if (response.ok) {
                message = await response.json() as IBackendError;
                return message
            }
            else {
                throw new Error(`${response.status}`)
            }
        } catch (error) {
            const myError: IBackendError  = {
                message: error as string
            };

            return myError;
        }
    }
}