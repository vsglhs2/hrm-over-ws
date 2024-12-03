import { EnvironmentOptions, Environment } from '../../base';


type ServiceWorkerEnvironmentOptions = EnvironmentOptions & {
    store: Store;
};

export class ServiceWorkerEnvironment extends Environment {

	constructor({ options }: ServiceWorkerEnvironmentOptions) {
		super({ options });
	}
}
