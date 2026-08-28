import {
	CallHandler,
	ExecutionContext,
	HttpException,
	Injectable,
	Logger,
	NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	private readonly logger = new Logger('HTTP');

	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		const request = context.switchToHttp().getRequest<Request>();
		const response = context.switchToHttp().getResponse<Response>();
		const { method, originalUrl } = request;
		const startTime = Date.now();

		return next.handle().pipe(
			tap(() => {
				const duration = Date.now() - startTime;
				this.logger.log(
					`${method} ${originalUrl} ${response.statusCode} +${duration}ms`,
				);
			}),
			catchError((error: unknown) => {
				const duration = Date.now() - startTime;
				const status =
					error instanceof HttpException ? error.getStatus() : 500;
				this.logger.warn(
					`${method} ${originalUrl} ${status} +${duration}ms`,
				);
				return throwError(() => error);
			}),
		);
	}
}
