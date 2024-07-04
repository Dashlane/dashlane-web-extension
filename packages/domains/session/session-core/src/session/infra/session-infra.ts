import { Injectable } from '@dashlane/framework-application';
@Injectable()
export abstract class SessionConfig {
    abstract isUserIdle(intervalSeconds: number): Promise<boolean>;
}
export class NullSessionConfig extends SessionConfig {
    isUserIdle(): Promise<boolean> {
        return Promise.resolve(false);
    }
}
