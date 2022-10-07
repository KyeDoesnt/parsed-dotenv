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
interface I_PDENV_ConfigOptions {
    /** Capitalization of parsed values.
     * - "uppercase" - Makes all pdenv values uppercase. ( VARIABLEFROMENV )
     * - "lowercase" - Makes all pdenv values lowercase. ( variablefromenv )
     * - "as-is"     - Keeps capitalization from pdenv.  ( VariableFromENV )
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
    custom_parse_fn?: (() => any) | undefined;
    /** Expressions of acceptable strings.
     * @default  */ string_parse_exps?: RegExp[];
    /** Expressions of acceptable arrays.
     * @default  */ array_parse_exps?: RegExp[];
    /** Expressions of acceptable numbers.
     * @default [] */ number_parse_exps?: RegExp[];
    /** Expressions of acceptable booleans.
     * @default [] */ bool_parse_exps?: RegExp[];
    /** Name of .env file.
     * @default '.env' */
    file_name?: string;
    /** Directory to .env file - relative to `process.cwd()`.
     * @default '' */
    directory?: string;
    /** Encoding of .env file.
     * @default 'utf-8' */
    encoding?: BufferEncoding;
    /** Output logs to console?
     * @default false */
    logging?: boolean;
    /** Output debug content to console?
     * @default false */
    verbose?: boolean;
}
declare const config: (options?: I_PDENV_ConfigOptions) => void;
/** Calls given function when error occurs. */
declare const onError: (callback: (() => void)) => void;
declare const pdenv: {
    config: (options?: I_PDENV_ConfigOptions) => void;
    onError: (callback: (() => void)) => void;
};
export { config, onError, };
export default pdenv;
