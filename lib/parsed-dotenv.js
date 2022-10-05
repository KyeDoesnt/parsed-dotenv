"use strict";
/// trans rights = human rights, black lives matter, slava ukraini. ✨
/// kye cedar :3c
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const path_1 = require("path");
const os_1 = require("os");
const pkgjson = require('../package.json');
const version = 'v' + pkgjson.version;
let m_do_verbose_logging = false;
;
/** Default pdenv config values. */
const PDENV_CONFIGDEFAULTS = {
    file_name: '.env',
    directory: '',
    verbose: false,
};
const config = (options = PDENV_CONFIGDEFAULTS) => {
    const { file_name, directory, verbose } = Object.assign(PDENV_CONFIGDEFAULTS, options);
    // set verbose mode with given config options.
    m_do_verbose_logging = verbose;
    m_log('verbose logging enabled.');
    // resolve home directory. ( '~/Documents/' -> '/home/username/Documents/' )
    let directory_split = directory.split('/');
    let fmt_directory = directory_split[0] === '~'
        ? `${(0, os_1.homedir)()}/${directory_split.splice(1).join('/')}`
        : directory;
    // read directory to .env file.
    const file_path = (0, path_1.resolve)(process.cwd(), fmt_directory, file_name);
    m_log(`file path obtained: ${file_path}`);
};
exports.config = config;
// === === === === === === === === === === === === ===
const m_log = (message) => {
    // only log if in verbose mode.
    if (!m_do_verbose_logging)
        return;
    console.log(`\x1b[0m\x1b[2m[pdenv]\x1b[0m ${message}`);
};
// === === === === === === === === === === === === ===
/// EXPORTS
const pdenv = { config, };
exports.default = pdenv;
//# sourceMappingURL=parsed-dotenv.js.map