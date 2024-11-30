import { PluginOptions } from "@/options";

type PartialClientEnvironmentOptions = {
    options: Pick<PluginOptions, 'constants'>;
};

export class PartialClientEnvironment {
    public readonly options: Pick<PluginOptions, 'constants'>;

    constructor({ options }: PartialClientEnvironmentOptions) {
        this.options = options;
    }
}
