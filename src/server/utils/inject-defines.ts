import { pluginName } from '@/options';
import child_process from 'node:child_process';

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