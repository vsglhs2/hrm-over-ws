import { exec as unpreparedExec } from 'child_process';
import { promisify } from 'util';
import { replaceTscAliasPaths } from 'tsc-alias';

const defaultLogOptions = {
	type: 'log',
	showTimestamp: false,
	insertNewLine: false,
	ignoreFalsey: true,
};

function createLogger(options = defaultLogOptions) {
	const loggerOptions = {
		...defaultLogOptions,
		...options,
	};

	return function log(message, options) {
		const {
			type,
			showTimestamp,
			insertNewLine,
			ignoreFalsey,
		} = {
			...defaultLogOptions,
			...loggerOptions,
			...options,
		};

		if (ignoreFalsey && !message) return;

		let preparedMessage = message;
		if (showTimestamp) preparedMessage += `: ${performance.now()}`;
		if (insertNewLine) preparedMessage += '\n';

		const logMethod = type === 'error' ? console.error : console.log;

		logMethod(preparedMessage);
	};
}

const promisifiedExec = promisify(unpreparedExec);
const defaultExecOptions = {
	logAfter: null,
	logBefore: null,
	logOptions: {
		type: 'log',
		showTimestamp: true,
		insertNewLine: true,
		ignoreFalsey: true,
	},
};

async function execAsync(command, options = defaultExecOptions) {
	const {
		logAfter,
		logBefore,
		logOptions,
	} = {
		...defaultExecOptions,
		...options,
		logOptions: {
			...defaultExecOptions.logOptions,
			...options?.logOptions,
		},
	};

	const log = createLogger(logOptions);

	log(logBefore);
	const execResult = await promisifiedExec(command);

	// log(execResult.stdout, {
	// 	showTimestamp: false,
	// 	insertNewLine: false,
	// });
	log(execResult.stderr, {
		type: 'error',
		showTimestamp: false,
		insertNewLine: false,
	});

	log(logAfter);

	return execResult;
}

const log = createLogger({
	type: 'log',
	showTimestamp: true,
	insertNewLine: true,
	ignoreFalsey: true,
});

log('Building');
await execAsync('rm -rf dist/', {
	logAfter: 'Cleaned up',
});

await execAsync('mkdir -p dist/assets && mkdir -p dist/server && mkdir -p dist/client && mkdir -p dist/@types && cp -r src/server/assets dist/ && cp package.json dist/server/package.json', {
	logAfter: 'Copied assets',
});

const clientCompilePromise = execAsync('npx swc src/**/* package.json -d dist/client --config-file client.swcrc', {
	logAfter: 'Compiled client',
});
const clientBundlePromise = clientCompilePromise
	.then(() => {
		log('Bundling client');
		const installBundlePromise = execAsync('npx esbuild dist/client/src/client/install.js --bundle --outfile=dist/assets/install.js --format=esm', {
			logAfter: 'Bundled install script',
		});
		const registerBundlePromise = execAsync('npx esbuild dist/client/src/client/register.js --bundle --outfile=dist/assets/register.js --format=esm', {
			logAfter: 'Bundled register script',
		});
		const scriptBundlePromise = execAsync('npx esbuild dist/client/src/client/script.js --bundle --outfile=dist/assets/script.js --format=esm', {
			logAfter: 'Bundled worker script',
		});

		return Promise.all([installBundlePromise, registerBundlePromise, scriptBundlePromise]);
	})
	.then(() => log('Finished client'));

const serverCompilePromise = execAsync('npx swc src/**/* package.json src/* -d dist/server --config-file server.swcrc', {
	logAfter: 'Compiled server',
});
const serverBundlePromise = serverCompilePromise
	.then(() =>
		execAsync('npx esbuild dist/server/src/index.js --bundle --outfile=dist/index.js --format=cjs --platform=node', {
			logAfter: 'Bundled server',
		}),
	)
	.then(() => log('Finished server'));

const typesEmitPromise = execAsync('npx tsc --project server.json --emitDeclarationOnly --declaration --declarationDir ./dist/@types --skipLibCheck', {
	logAfter: 'Emitted types',
});
const typesAliasPromise = typesEmitPromise
	.then(() => replaceTscAliasPaths({
		configFile: 'server.json',
		resolveFullPaths: true,
		declarationDir: 'dist/@types',

	}))
	.then(() => log('Aliased types'));

await Promise.all([clientBundlePromise, serverBundlePromise, typesAliasPromise]);

await execAsync('rm -rf dist/client && rm -rf dist/server', {
	logAfter: 'Cleaned up',
});

log('Finished build');
