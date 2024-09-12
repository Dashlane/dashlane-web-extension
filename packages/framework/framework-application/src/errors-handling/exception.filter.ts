import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { ApplicationResponse } from "../application/nest-adapters/nest-request-response-bus";
@Catch(Error)
export class ApplicationExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<ApplicationResponse>();
    response.fail(exception);
  }
}
