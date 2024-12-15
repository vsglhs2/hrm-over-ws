import { RequestHandler } from '@/lib/handler';
import { Environment, EnvironmentOptions } from '../base';

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
