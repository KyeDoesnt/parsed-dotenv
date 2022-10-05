/// trans rights = human rights, black lives matter, slava ukraini. ✨
/// kye cedar :3c

// === === === === === === === === === === === === ===

import {} from 'fs';
import { resolve as pathResolve } from 'path';
import { homedir as osHomedir } from 'os';

const pkgjson = require('../package.json');

const version: string = 'v' + pkgjson.version;

let m_do_verbose_logging = false;

// === === === === === === === === === === === === ===

interface I_PDENV_ConfigOptions
	{
		/** Name of .env file. */
		file_name? : string;
		
		/** Directory to .env file - relative to `process.cwd()`. */
		directory? : string;

		/** Output debug content to console? */
		verbose?   : boolean;
	};

/** Default pdenv config values. */
const PDENV_CONFIGDEFAULTS =
	{
		file_name : '.env',
		directory : '',
		verbose   : false,
	};

const config = (options: I_PDENV_ConfigOptions = PDENV_CONFIGDEFAULTS): void =>
	{
		const { file_name, directory, verbose } = Object.assign(PDENV_CONFIGDEFAULTS, options);

		// set verbose mode with given config options.
		m_do_verbose_logging = verbose;
		m_log('verbose logging enabled.');

		// resolve home directory. ( '~/Documents/' -> '/home/username/Documents/' )
		let directory_split = directory.split('/');
		let fmt_directory =
			directory_split[0] === '~'
				? `${osHomedir()}/${directory_split.splice(1).join('/')}`
				: directory;

		// read directory to .env file.
		const file_path = pathResolve(process.cwd(), fmt_directory, file_name);
		m_log(`file path obtained: ${file_path}`);

		
	};

// === === === === === === === === === === === === ===

const m_log = (message: string): void =>
	{
		// only log if in verbose mode.
		if(!m_do_verbose_logging) return;
		console.log(`\x1b[0m\x1b[2m[pdenv]\x1b[0m ${message}`);
	};

// === === === === === === === === === === === === ===

/// EXPORTS
const pdenv =
	{ config, };

export { config, };
export default pdenv;