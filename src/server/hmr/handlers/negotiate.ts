import { ServerEnvironment } from "@/lib/environment";
import { JsonSerializer } from "@/lib/serializer";
import { replacerFunction } from "@/lib/utils/json-transform-functions";

export function negotiateHandler(this: ServerEnvironment) {
    const jsonSerializer = new JsonSerializer({
        replacer: replacerFunction,
    });
    // @ts-expect-error Options contains function type in it
    const serializedOptions = jsonSerializer.serialize(this.options);

    console.log('Got negotiation request')
    this.server.ws.send(this.eventName('initialize'), serializedOptions);

    const moduleUrls = Array.from(this.server.moduleGraph.urlToModuleMap.keys());
    this.server.ws.send(this.eventName('modules'), moduleUrls);
}
