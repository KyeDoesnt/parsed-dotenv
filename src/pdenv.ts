/// trans rights = human rights, black lives matter, slava ukraini. ✨
/// kye cedar :3c

// === === === === === === === === === === === === ===

import
	{
		existsSync   as fsExistsSync,
		readFileSync as fsReadFileSync
	} from 'fs';

import { resolve as pathResolve } from 'path';
import { homedir as osHomedir } from 'os';
import { listenerCount } from 'process';
import { stringify } from 'querystring';

const pkgjson = require('../package.json');

const version: string = 'v' + pkgjson.version;

let m_do_logging         : boolean             = false;
let m_do_verbose_logging : boolean             = false;
let m_on_error           : (() => void) | null = null;

// === === === === === === === === === === === === ===

// pdenv interface. all process.pdenv children will be a key{string}, and value{any}.
interface PDENV
	{ [key: string]: any; }

// add pdenv to process.
// https://stackoverflow.com/questions/45194598/using-process-env-in-typescript
declare global { namespace NodeJS { interface Process
	{ pdenv: PDENV; }}}

process.pdenv = {};

// === === === === === === === === === === === === ===

interface I_PDENV_ConfigOptions
	{
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
		 * @default  */ // TODO
		string_parse_exps?: RegExp[];

		/** Expressions of acceptable arrays.
		 * @default  */ // TODO
		array_parse_exps?: RegExp[];

		/** Expressions of acceptable numbers.
		 * @default [] */ // TODO
		number_parse_exps?: RegExp[];

		/** Expressions of acceptable booleans.
		 * @default [] */ // TODO
		bool_parse_exps?: RegExp[];

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

// we have two of these so the errors go away :(
interface I_PDENV_ConfigDefaults
	{
		capitalization     : 'uppercase' | 'lowercase' | 'as-is';
		extract_exp        : RegExp;
		trim_exp           : RegExp;
		comment_exp        : RegExp;
		custom_parse_fn    : undefined;
		string_parse_exps  : RegExp[];
		array_parse_exps   : RegExp[];
		number_parse_exps  : RegExp[];
		bool_parse_exps    : RegExp[];
		file_name          : string;
		directory          : string;
		encoding           : BufferEncoding;
		logging            : boolean;
		verbose            : boolean;
	}

/** Default pdenv config values. */
const PDENV_CONFIGDEFAULTS: I_PDENV_ConfigDefaults =
	{
		capitalization     : 'as-is',
		extract_exp        : /(.+)=(.+)/,
		trim_exp           : /(^(\s+)|(\s+)$)/g,
		comment_exp        : /((?:(?!#).)*)/,
		custom_parse_fn    : undefined,
		string_parse_exps  : [/^'.*'$/, /^".*"$/, /^`.*`$/],
		array_parse_exps   : [/^\[.*\]$/], // TODO impliment array shit
		number_parse_exps  : [/((^[0-9]+$)|(^[0-9]*\.[0-9]+$))/],
		bool_parse_exps    : [/(^true$)|(^false$)/i],
		file_name          : '.env',
		directory          : '',
		encoding           : 'utf-8',
		logging            : false,
		verbose            : false,
	};

const config = (options: I_PDENV_ConfigOptions = {}): void =>
	{
		const
			{
				// text.
				capitalization,

				// match.
				extract_exp, trim_exp, comment_exp,

				// file.
				file_name, directory, encoding,

				// parsing.
				custom_parse_fn, string_parse_exps, array_parse_exps,
				number_parse_exps, bool_parse_exps,

				// logging.
				logging, verbose,

			} = Object.assign({...PDENV_CONFIGDEFAULTS}, options);
			// clone PDENV_CONFIGDEFAULTS, since maybe pdenv is used with multiple envs.

		// set logging and verbose mode with given config options.
		m_do_logging         = logging;
		m_do_verbose_logging = verbose;
		m_log(`operational. ${version}`, 'SUCCESS');
		m_log('verbose logging enabled.'); // can't log 'logging enabled.', cause INFO only logs when verbose mode is enabled.

		m_log('\n');

		m_log('this is a success.', 'SUCCESS', true);
		m_log('this is a warning.', 'WARN', true);
		m_log('this is a error.', 'ERROR', true);
		
		m_log('\n');

		// resolve home directory. ( '~/Documents/' -> '/home/username/Documents/' )
		let directory_split = directory.split('/');
		let fmt_directory =
			directory_split[0] === '~'
				? `${osHomedir()}/${directory_split.splice(1).join('/')}`
				: directory;

		// get path to .env file.
		const file_path = pathResolve(process.cwd(), fmt_directory, file_name);
		m_log(`file path obtained:\n\t${file_path}`);

		// check if file exists.
		if(!fsExistsSync(file_path))
			{
				m_log('unable to find file. if file exists, check read perms.', 'WARN');
				return;
			}
		
		// read file.
		m_log('file found. attempting to read.');
		
		let file_content: string[] = [];
		try
			{
				file_content = fsReadFileSync(file_path, { encoding }).split('\n');
			}
		catch(err)
			{
				m_log(`not able to read file.\n\t${err}`, 'ERROR');
				return;
			}

		m_log('file content extracted.');

		// extract and parse text.
		m_log('processing extracted text...');
		file_content
			.forEach((line: string) =>
				{
					// comb line-by line and regex match.
					//     if RegExpMatchArray, parse and trim.
					//     elif null, discard.
					// separate out extracted values to next step.
					// store in "process.pdenv".

					const matched_line: RegExpMatchArray | null = line.match(extract_exp);

					// return if no match found, not keeping unwanted lines.
					if(matched_line == null) return;

					// split at '='.
					const line_split: string[] = matched_line[0].split('=');

					// console.log(line_split);

					let line_key: string = line_split[0].replace(trim_exp, ''); // get, trim key.
					let line_val: any    = line_split
						.slice(1).join('') // get key, seamless join.
						.match(comment_exp)![0] // trim comments.
						.replace(trim_exp, ''); // trim whitespace.

					// key capitalization.
					switch(capitalization)
						{
							case 'lowercase':
								line_key = line_key.toLowerCase();
								break;
							case 'uppercase':
								line_key = line_key.toUpperCase();
								break;
						}

					// parse values.
					line_val = m_parse(line_val, string_parse_exps, array_parse_exps, number_parse_exps, bool_parse_exps, custom_parse_fn);
					
					process.pdenv[line_key] = line_val;
				});
		
		m_log(`${capitalization} capitalization enforced on keys.`);

		m_log('trimmed, parsed, packed variables.');

		m_log('configured.', 'SUCCESS');
	};

// === === === === === === === === === === === === ===

/** Calls given function when error occurs. */
const onError = (callback: (() => void)): void => // TODO!!! make error-handling system.
	{ m_on_error = callback; };

// === === === === === === === === === === === === ===

type PDENV_CUSTOM_PARSE_FUNCTION =
	(string_parse_exps: RegExp[], array_parse_exps: RegExp[], number_parse_exps: RegExp[], bool_parse_exps: RegExp[]) => any;

/** Parses string and returns interpreted value. */
const m_parse = (
	data: string,
	string_parse_exps : RegExp[],
	array_parse_exps  : RegExp[],
	number_parse_exps : RegExp[],
	bool_parse_exps   : RegExp[],
	custom_parse_fn?: PDENV_CUSTOM_PARSE_FUNCTION
): any =>
	{
		// TODO if string starts with " or ' or `, then interpret as string.
		// if value ends with *, parse as string, account for escape char.
		// if starts with [, then parse as array, account for escape char.
		//  	if value in arr ends with *, parse as string, account for escape char.

		// TODO make it so there's a set of characters that represent the # symbol, replace in value if string.

		// use custom parse function if available.
		if(custom_parse_fn != undefined)
			return custom_parse_fn(string_parse_exps, array_parse_exps, number_parse_exps, bool_parse_exps);

		// use default function if no custom parse function given.
		// check if ending has asterisk with no escape character, just parse as string if so.
		let ignore_parse_search = data.slice(-2);
		if(ignore_parse_search.length > 1)
			if(
				ignore_parse_search != '\\*' &&
				ignore_parse_search.split('')[1] == '*'
			) return data;

		// test expressions.
		let   is_string : boolean = m_testAll(data, string_parse_exps);
		const is_array  : boolean = m_testAll(data, array_parse_exps);
		const is_number : boolean = m_testAll(data, number_parse_exps); 
		const is_bool   : boolean = m_testAll(data, bool_parse_exps);

		// TODO make this much better please 👇
		// if the string has string characters at the end, remove them.
		if(is_string) if(data[0] == '\"') data = data.slice(1, -1);

		// default to parsing by string.
		if(!(is_string && is_array && is_number && is_bool)) is_string = true;
		
		// TODO check for if multiple are true.
		// TODO impliment arrays.

		if(is_number) return parseFloat(data);
		else if(is_bool) return (data.toLowerCase() == 'true');
		else if(is_array) return []; // TODO!!! IMPLIMENT ARRAYS!!!
		else if(is_string) return data;

		// just in case.
		return data;
	};

/** Tests an array of expressions against a string.
 * @returns {boolean} True if at least one is true, false if any is false. */
const m_testAll = (target: string, expressions: RegExp[]): boolean =>
	{
		for(let i in expressions)
			{
				if(expressions[i].test(target)) return true;
			}
		return false;
	};

/** Tests if the string we're tryna parse has an asterisk, and no escape character before it.
 * @returns {boolean} */
const m_doIgnoreParse = (data: string): boolean =>
	{
		let ignore_parse_search = data.slice(-2);
		if(ignore_parse_search.length > 1)
			if(
				ignore_parse_search != '\\*' &&
				ignore_parse_search.split('')[1] == '*'
			) return true;
		return false;
	};

const m_log = (message: string, priority: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR' = 'INFO', dummy: boolean = false): void =>
	{
		// return if logging isn't enabled.
		if(!m_do_logging) return;
		// only log info if in verbose mode, only log dummy logs in verbose mode.
		if(priority == 'INFO' || dummy) if(!m_do_verbose_logging) return;
		if(message == '\n') return console.log('\n');

		let prio_text: string = '';
		switch(priority)
		{
			case 'SUCCESS':
				prio_text = '\x1b[36m ● ';
				break;
			case 'WARN':
				prio_text = '\x1b[33m ▲ ';
				break;
			case 'ERROR':
				prio_text = '\x1b[31m × ';
				break;
		}

		// adding lil thing that denotes if it's a warning or an error if it's a warning or an error.
		prio_text = (priority != 'INFO')
			? `\x1b[7m${prio_text}\x1b[0m `
			: '';

		console.log(`\x1b[0m\x1b[2m[pdenv]\x1b[0m ${prio_text}${message}`);

		// only call error callback if not a dummy log.
		if(!dummy && m_on_error) m_on_error();
	};

// === === === === === === === === === === === === ===

/// EXPORTS
const pdenv =
	{ config, onError, };

export { config, onError, };
export default pdenv;