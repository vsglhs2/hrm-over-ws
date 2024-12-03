import httpMocks, { RequestMethod } from 'node-mocks-http';
import { ServerResponse } from 'node:http';
import { Connect } from 'vite';

import { SocketEnvironment } from '@/lib/environment';
import { getHeadersRecord } from '@/lib/utils';
import { retrieveTransformFunctionFromServer } from '@/server/utils';

export async function moduleHandler(
	this: SocketEnvironment,
	buffer: Buffer,
	ack: (buffer: ArrayBuffer) => void
) {
	const data = this.serializers.request.deserialize(buffer);

	const req: Connect.IncomingMessage = httpMocks.createRequest({
		url: new URL(data.url).pathname,
		method: data.method as RequestMethod,
		headers: getHeadersRecord(data.headers)
	});

	try {
		// In function root middlewares array is empty
		const transformHandler = retrieveTransformFunctionFromServer(this.server);

		// console.log(`Requested module from ${socketAppendix}:`, data);

		const res: ServerResponse = httpMocks.createResponse({
			req: req
		});

		await transformHandler(req, res, async (err) => {
			if (err) {
				console.error(err);
				return;
			}
		});

		// @ts-expect-error TODO: somehow req is empty here, so serialize throws
		res.req = req;

		const serialized = await this.serializers.response.serialize(res);
		ack(serialized.buffer);
	} catch (err) {
		const error = err instanceof Error ? err : new Error('Unknown error: ' + String(err));
		console.error(`Error during fetching module from ${this.socketAppendix}:`, error.message);

		const res: ServerResponse = httpMocks.createResponse({
			req: req
		});
		res.statusCode = 404;
		res.end(error.message);

		const serialized = await this.serializers.response.serialize(res);
		ack(serialized.buffer);
	}
}
