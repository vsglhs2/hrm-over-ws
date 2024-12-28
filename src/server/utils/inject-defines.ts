import { ServerEnvironment } from '@/lib/environment/server';
import { pluginName, pluginVersion } from '@/options';
import child_process from 'node:child_process';

export function createDefines(environment: ServerEnvironment) {
	return {
		__SERVICE_WORKER_INSTALLED_HEADER__:
			JSON.stringify(environment.options.constants.serviceWorker.installedHeader),
		__SERVICE_WORKER_SCRIPT_PATH__:
			JSON.stringify(environment.options.constants.serviceWorker.scriptPath),
		__SERVICE_WORKER_INSTALL_PAGE_PATH__:
			JSON.stringify(environment.options.constants.serviceWorker.installPagePath),
		__SERVICE_WORKER_INSTALL_PAGE_SOURCES__:
			JSON.stringify(
				environment.options.constants.serviceWorker.installPageSources
			),
		__PLUGIN_VERSION__: JSON.stringify(pluginVersion),
		__PLUGIN_NAME__: JSON.stringify(pluginName),
		__EVENT_PREFIX__: JSON.stringify(environment.options.constants.eventPrefix),
		__BASE_URL__: JSON.stringify(environment.options.constants.baseUrl),
		__PLUGIN_PATH__: JSON.stringify(environment.options.constants.pluginPath),
	};
}

function buildInjectString(
	inputFile: string,
	outputFile: string,
	defineRecord: Record<string, unknown>
) {
	const esbuildCommandBase = 'npx esbuild';
	const defineCommandParts = Object
		.entries(defineRecord)
		.map(([key, value]) => {
			const commandBase = '--define:';
			const preparedValue = value;

			return `${commandBase}${key}=\'${preparedValue}\'`;
		});
	const defineCommand = defineCommandParts.join(' ');

	return `${esbuildCommandBase} ${inputFile} ${defineCommand} --outfile=${outputFile}`;
}

export function injectClientDefines(defineRecord: Record<string, string>) {
	const filePath = `node_modules/${pluginName}/dist/client/`;
	const inputAppendix = 'src/';

	const fileNames = [
		['install-bundle.js', 'install.js'],
		['register-bundle.js', 'register.js'],
		['script-bundle.js', 'script.js'],
	];

	for (const [inputName, outputName] of fileNames) {
		const inputPath = filePath + inputAppendix + inputName;
		const outputPath = filePath + outputName;

		const clientCommand = buildInjectString(
			inputPath,
			outputPath,
			defineRecord
		);
		child_process.execSync(clientCommand);
	}
}