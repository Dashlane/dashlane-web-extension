import Base from './Base';
export default class RemoteTime extends Base {
    protected WSVERSION = 1;
    protected WSNAME = 'remotetime';
    public get() {
        return this._makeRequest('get', {}, { rawResult: true }) as Promise<any>;
    }
}
