import { Connect, ViteDevServer } from 'vite';

import { FunctionToAsync } from '@/lib/utils';

const TRANSFORM_FUNCTION_NAME = 'viteTransformMiddleware';

export function retrieveTransformFunctionFromServer(server: ViteDevServer) {
	const item = server.middlewares.stack.find(
		item => typeof item.handle === 'function' &&
            item.handle.name === TRANSFORM_FUNCTION_NAME,
	);

	if (!item) throw new Error('Can\'t find viteTransformMiddleware function');

	return item.handle as FunctionToAsync<Connect.NextHandleFunction>;
}
