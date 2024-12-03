import { TransportModuleHandler } from '@/lib/handler';
import { Environment, EnvironmentOptions } from '../base';

type ClientEnvironmentOptions = EnvironmentOptions & {
	moduleHandler: TransportModuleHandler;
};

export class ClientEnvironment extends Environment {
	public readonly moduleHandler: TransportModuleHandler;

	constructor({ options, moduleHandler }: ClientEnvironmentOptions) {
		super({ options });

		this.moduleHandler = moduleHandler;
	}
}
