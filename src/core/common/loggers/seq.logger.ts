import { ConsoleLogger } from '@nestjs/common';
import { Logger as SeqClient } from 'seq-logging';

export class SeqLogger extends ConsoleLogger {
	private readonly seq: SeqClient;

	constructor(serverUrl: string) {
		super();
		this.seq = new SeqClient({
			serverUrl,
			onError: (error: Error) =>
				super.error(
					`Seq logging error: ${error.message}`,
					undefined,
					'Seq',
				),
		});
	}

	log(message: unknown, context?: string): void {
		super.log(message, context);
		this.emit('Information', message, context);
	}

	warn(message: unknown, context?: string): void {
		super.warn(message, context);
		this.emit('Warning', message, context);
	}

	error(message: unknown, stack?: string, context?: string): void {
		super.error(message, stack, context);
		this.emit('Error', message, context, stack);
	}

	debug(message: unknown, context?: string): void {
		super.debug(message, context);
		this.emit('Debug', message, context);
	}

	verbose(message: unknown, context?: string): void {
		super.verbose(message, context);
		this.emit('Verbose', message, context);
	}

	private emit(
		level: string,
		message: unknown,
		context?: string,
		stack?: string,
	): void {
		this.seq.emit({
			timestamp: new Date(),
			level,
			messageTemplate: '[{Context}] {Message}',
			properties: {
				Context: context ?? 'Application',
				Message: String(message),
				...(stack ? { Stack: stack } : {}),
			},
		});
	}
}
