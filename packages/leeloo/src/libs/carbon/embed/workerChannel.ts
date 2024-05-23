import { GenericChannel } from 'ts-event-bus';
export interface WorkerChannelOptions {
    isHost: boolean;
    timeout?: number;
    type: string;
    worker?: Worker;
}
export class WorkerChannel extends GenericChannel {
    private isHost: boolean;
    private type: string;
    private worker?: Worker;
    public constructor({ worker, type, isHost, timeout }: WorkerChannelOptions) {
        if (timeout) {
            super(timeout);
        }
        else {
            super();
        }
        this.type = type;
        this.isHost = isHost;
        if (worker) {
            this.setWorker(worker);
        }
    }
    public setWorker(worker: Worker) {
        this.worker = worker;
        this.worker.addEventListener('message', ({ data }) => {
            if (!data || data.type !== this.type) {
                return;
            }
            if (data.content === 'connected') {
                if (!this.isHost) {
                    this.signalConnected();
                }
                this._connected();
                return;
            }
            else {
                this._messageReceived(data.content);
            }
        }, false);
        if (this.isHost) {
            this.signalConnected();
        }
    }
    public send(content: any) {
        if (!this.worker) {
            throw new Error('[workerChannel]: send was called before worker was set');
        }
        this.worker.postMessage({ type: this.type, content });
    }
    private signalConnected(): void {
        if (!this.worker) {
            throw new Error('[workerChannel]: signalConnected was called before worker was set');
        }
        this.worker.postMessage({ type: this.type, content: 'connected' });
    }
}
