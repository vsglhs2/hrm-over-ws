import { BufferedHandler, RequestHandler } from "@/lib/handler";

type Store = {
  handler: RequestHandler;
  info: InitializationInfo | null;
};

export function createStore(): Store {
  return {
    handler: new BufferedHandler(),
    info: null,
  };
}
