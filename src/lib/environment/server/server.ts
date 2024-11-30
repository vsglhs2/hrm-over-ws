import { ViteDevServer } from "vite";
import { Environment, EnvironmentOptions } from "../base";

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