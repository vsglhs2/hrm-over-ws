import { RequestSerializer, ResponseSerializer } from '@/lib/serializer';
import { RecursivePartial, resolveOptions } from '../utils';

export type RequestState = {
    request: Request;
    options: RequestOptions;
    response?: Response;
    promise?: Promise<Response>;
};

export type RequestOptions = {
    // maybe boolean | ((request: Request) => boolean) ?
    reuse: boolean;
};

const defaultOptions: RequestOptions = {
	reuse: false,
};

export abstract class RequestHandler {
	protected stateMap: WeakMap<Request, RequestState>;
	protected requestMap: Map<string, Request[]>;

	protected requestSerializer: RequestSerializer;
	protected responseSerializer: ResponseSerializer;

	constructor() {
		this.stateMap = new Map();
		this.requestMap = new Map();

		this.requestSerializer = new RequestSerializer();
		this.responseSerializer = new ResponseSerializer();
	}

    protected abstract process(request: Request): Promise<Response>;

    public async request(request: Request, options?: RecursivePartial<RequestOptions>): Promise<Response> {
    	const resolvedOptions = resolveOptions(options, defaultOptions);
    	const state = this.acquireState(request, resolvedOptions);

    	const promise = state.promise ?? this.process(request).then(response => {
    		state.response = response;
    		return response;
    	});
    	state.promise = promise;

    	return promise.then(response => response.clone());
    }

    protected getState(request: Request): RequestState | undefined {
    	return this.stateMap.get(request);
    }

    protected acquireState(request: Request, options: RequestOptions): RequestState {
    	const key = request.url + request.method;

    	let sameKeyRequests = this.requestMap.get(key);
    	if (sameKeyRequests?.length && options.reuse) {
    		return this.getState(sameKeyRequests[0])!;
    	}

    	if (!sameKeyRequests) sameKeyRequests = this.requestMap.set(key, []).get(key);
        sameKeyRequests!.push(request);

        const state: RequestState = {
        	request: request,
        	options: options,
        };
        this.stateMap.set(request, state);

        return state;
    }

    public close() {}
}
