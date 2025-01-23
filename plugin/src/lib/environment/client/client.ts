import type { RequestHandler } from '@/lib/handler';
import type { EnvironmentOptions } from '../base';
import { Environment } from '../base';

export type ClientEnvironmentOptions = EnvironmentOptions & {
	moduleHandler: RequestHandler;
};

export class ClientEnvironment extends Environment {
	public moduleHandler: RequestHandler;

	constructor({ options, moduleHandler }: ClientEnvironmentOptions) {
		super({ options });

		this.moduleHandler = moduleHandler;
	}
}
