/// <reference types="vite/client" />

declare const __PLUGIN_VERSION__: string;
declare const __PLUGIN_NAME__: string;
declare const __SERVICE_WORKER_INSTALLED_HEADER__: string;
declare const __SERVICE_WORKER_INSTALL_PAGE_PATH__: string;
declare const __SERVICE_WORKER_INSTALL_PAGE_SOURCES__: string[];
declare const __SERVICE_WORKER_SCRIPT_PATH__: string;

declare const __EVENT_PREFIX__: string;

// interface ImportMetaEnv {}

interface ImportMeta {
	// readonly env: ImportMetaEnv;
	readonly hot?: ViteHotContext;
}

interface ViteHotContext {
	readonly data: unknown;

	accept(): void;
	accept(cb: (mod: ModuleNamespace | undefined) => void): void;
	accept(dep: string, cb: (mod: ModuleNamespace | undefined) => void): void;
	accept(
		deps: readonly string[],
		cb: (mods: Array<ModuleNamespace | undefined>) => void
	): void;

	dispose(cb: (data: unknown) => void): void;
	prune(cb: (data: unknown) => void): void;
	invalidate(message?: string): void;

	on<T extends string>(
		event: T,
		cb: (payload: InferCustomEventPayload<T>) => void
	): void;
	off<T extends string>(
		event: T,
		cb: (payload: InferCustomEventPayload<T>) => void
	): void;
	send<T extends string>(event: T, data?: InferCustomEventPayload<T>): void;
}
