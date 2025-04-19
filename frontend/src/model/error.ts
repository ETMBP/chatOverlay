export class BackendError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'BackendError';
        Object.setPrototypeOf(this, BackendError.prototype);
    }
}