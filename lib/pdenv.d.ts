interface I_PDENV_ConfigOptions {
    /** Name of .env file. */
    file_name?: string;
    /** Directory to .env file - relative to `process.cwd()`. */
    directory?: string;
    /** Output debug content to console? */
    verbose?: boolean;
}
declare const config: (options?: I_PDENV_ConfigOptions) => void;
declare const pdenv: {
    config: (options?: I_PDENV_ConfigOptions) => void;
};
export { config, };
export default pdenv;
