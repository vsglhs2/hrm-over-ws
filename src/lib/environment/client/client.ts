import { Environment, EnvironmentOptions } from "../base";

type ClientEnvironmentOptions = EnvironmentOptions & {

};

export class ClientEnvironment extends Environment {

    constructor({ options }: ClientEnvironmentOptions) {
        super({ options });
    }
}