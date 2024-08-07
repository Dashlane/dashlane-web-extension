import { ExceptionLog, ExceptionType } from '@dashlane/communication';
import { AutofillEngineMessageLogger } from '../../../Api/types/logger';
import { AutofillEngineConnectors } from '../../../Api/server/context';
export const logException = (exception: unknown, exceptionType: ExceptionType, connectors: AutofillEngineConnectors, messageLogger: AutofillEngineMessageLogger, log: Partial<ExceptionLog>) => {
    const exceptionMessage = exception instanceof Error ? exception.message : String(exception);
    const stack = exception instanceof Error ? exception.stack : log.precisions;
    const message = [log.message, exceptionMessage]
        .filter((msg) => msg !== undefined)
        .join(' - ');
    void connectors.carbon.logException({
        exceptionType,
        log: {
            ...log,
            message,
            precisions: stack,
        },
    });
    if (!*****) {
        messageLogger(message, { stack });
    }
};
