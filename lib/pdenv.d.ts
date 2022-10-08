/// <reference types="node" />
interface PDENV {
    [key: string]: any;
}
declare global {
    namespace NodeJS {
        interface Process {
            pdenv: PDENV;
        }
    }
}
declare type PDENV_ERROR_CALLBACK = (err: string) => void;
declare type PDENV_CUSTOM_PARSE_FUNCTION = (string_parse_exps: RegExp[], array_parse_exps: RegExp[], object_parse_exps: RegExp[], number_parse_exps: RegExp[], bool_parse_exps: RegExp[]) => any;
interface I_PDENV_ConfigOptions {
    /** Error callback. Called when an error occurs in pdenv.
     * @default null */
    errorFn?: PDENV_ERROR_CALLBACK | null;
    /** Capitalization of parsed keys.
     * - "uppercase" - Makes all pdenv keys uppercase. ( VARIABLEFROMENV )
     * - "lowercase" - Makes all pdenv keys lowercase. ( variablefromenv )
     * - "as-is"     - Keeps capitalization of keys from pdenv.  ( VariableFromENV )
     * @default 'as-is' */
    capitalization?: 'uppercase' | 'lowercase' | 'as-is';
    /** Expression that matches for lines to extract. "VARIABLE=VALUE"
     * @default /(.+)=(.+)(?=#)?/g */
    extract_exp?: RegExp;
    /** Expression that matches for leading and trailing whitespace. "  VARIABLE=VALUE "
     * @default /(.+)=(.+)/ */
    trim_exp?: RegExp;
    /** Expression that discludes comments. "VARIABLE=VALUE # Comment."
     * @default /((?:(?!#).)*)/ */
    comment_exp?: RegExp;
    /** Custom function to parse values of variables.
     * @default undefined */
    custom_parse_fn?: PDENV_CUSTOM_PARSE_FUNCTION | undefined;
    /** Expressions that test for acceptable strings.
     * @default [/^".*"$/] */ string_parse_exps?: RegExp[];
    /** Expressions that test for acceptable arrays.
     * @default [/^\[.*\]$/] */ array_parse_exps?: RegExp[];
    /** Expressions that test for acceptable objects.
     * @default [/^\{.*\}$/] */
    object_parse_exps?: RegExp[];
    /** Expressions that test for acceptable numbers.
     * @default [/((^[0-9]+$)|(^[0-9]*\.[0-9]+$))/] */ number_parse_exps?: RegExp[];
    /** Expressions that test for acceptable booleans.
     * @default [/(^true$)|(^false$)/i] */ bool_parse_exps?: RegExp[];
    /** Name of .env file.
     * @default '.env' */
    file_name?: string;
    /** Directory to .env file - relative to `process.cwd()`.
     * @default '' */
    directory?: string;
    /** Encoding of .env file.
     * @default 'utf-8' */
    encoding?: BufferEncoding;
    /** If pdenv outputs logs to console.
     * @default false */
    logging?: boolean;
    /** If pdenv outputs debug content to console.
     * @default false */
    verbose?: boolean;
}
/** Configures and loads in environment variables to `process.pdenv`.
 * @param {I_PDENV_ConfigOptions}					[options]
 * @param {PDENV_ERROR_CALLBACK}					[options.errorFn=null]
 *													- Error callback. Called when an error occurs in pdenv.
 * @param {'as-is' | 'lowercase' | 'uppercase'}		[options.capitalization='as-is']
 *													- Capitalization of parsed keys.
 * @param {RegExp}									[options.extract_exp=/(.+)=(.+)/]
 *													- Expression that matches for lines to extract as variables from `.env` file.
 * @param {RegExp}									[options.trim_exp=/(^(\s+)|(\s+)$)/g]
 *													- Expression that removes leading and trailing whitespace.
 * @param {RegExp}									[options.comment_exp=/((?:(?!#).)*)/]
 *													- Expression that matches for everything before the comment.
 * @param {PDENV_CUSTOM_PARSE_FUNCTION | undefined}	[options.custom_parse_fn=undefined]
 *													- Custom function that's used instead of normal parse function.
 * @param {RegExp[]}								[options.string_parse_exps=[/^".*"$/]]
 *													- Expressions that test for perceived strings as values.
 * @param {RegExp[]}								[options.array_parse_exps=[/^\[.*\]$/]]
 *													- Expressions that test for perceived arrays as values.
 * @param {RegExp[]}								[options.object_parse_exps=[/^\{.*\}$/]]
 *													- Expressions that test for perceived objects as values.
 * @param {RegExp[]}								[options.number_parse_exps=[/((^[0-9]+$)|(^[0-9]*\.[0-9]+$))/]]
 *													- Expressions that test for perceived numbers as values.
 * @param {RegExp[]}								[options.bool_parse_exps=[/(^true$)|(^false$)/i]]
 *													- Expressions that test for perceived booleans as values.
 * @param {string}									[options.file_name='.env']
 *													- Name of the file with the environment variables you wanna parse.
 * @param {string}									[options.directory='']
 *													- Path to the directory, relative to the `package.json` file. Can be absolute.
 * @param {BufferEncoding}							[options.encoding='utf-8']
 *													- Encoding of the environment file.
 * @param {boolean}									[options.logging=false]
 *													- If pdenv should log to console.
 * @param {boolean}									[options.verbose=false]
 *													- If pdenv should log debug info to console ( makes it talk a lot ).
 */
declare const config: (options?: I_PDENV_ConfigOptions) => void;
/** Calls given function when error occurs. */
declare const onError: (callback: PDENV_ERROR_CALLBACK) => void;
declare const pdenv: {
    config: (options?: I_PDENV_ConfigOptions) => void;
    onError: (callback: PDENV_ERROR_CALLBACK) => void;
};
export { config, onError, };
export default pdenv;
