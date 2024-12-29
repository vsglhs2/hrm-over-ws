import type { ViteDevServer } from 'vite';

import type { EnvironmentOptions } from '../base';
import { Environment } from '../base';

export type ServerEnvironmentOptions = EnvironmentOptions & {
    server: ViteDevServer;
};

export class ServerEnvironment extends Environment {
	public readonly server: ViteDevServer;

	constructor({ options, server }: ServerEnvironmentOptions) {
		super({ options });

		this.server = server;
	}
}
