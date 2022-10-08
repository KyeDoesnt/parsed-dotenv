"use strict";
/// trans rights = human rights, black lives matter, slava ukraini. ✨
/// kye cedar :3c
Object.defineProperty(exports, "__esModule", { value: true });
exports.onError = exports.config = void 0;
// === === === === === === === === === === === === ===
/// Please bear with my formatting, it makes it easier for me to read
/// and I just wanted to make something that was functional.
// === === === === === === === === === === === === ===
const fs_1 = require("fs");
const path_1 = require("path");
const os_1 = require("os");
const unescapejs = require('unescape-js');
const pkgjson = require('../package.json');
const version = 'v' + pkgjson.version;
let m_do_logging = false;
let m_do_verbose_logging = false;
let m_onError = null;
process.pdenv = {};
// === === === === === === === === === === === === ===
const PDENV_ESCAPED_BACKSLASH = '_PDENV{**ESCAPED_BACKSLASH}';
/** Default pdenv config values. */
const PDENV_CONFIGDEFAULTS = {
    errorFn: null,
    capitalization: 'as-is',
    extract_exp: /(.+)=(.+)/,
    trim_exp: /(^(\s+)|(\s+)$)/g,
    comment_exp: /((?:(?!#).)*)/,
    custom_parse_fn: undefined,
    string_parse_exps: [/^".*"$/],
    array_parse_exps: [/^\[.*\]$/],
    object_parse_exps: [/^\{.*\}$/],
    number_parse_exps: [/((^[0-9]+$)|(^[0-9]*\.[0-9]+$))/],
    bool_parse_exps: [/(^true$)|(^false$)/i],
    file_name: '.env',
    directory: '',
    encoding: 'utf-8',
    logging: false,
    verbose: false,
};
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
const config = (options = {}) => {
    const { 
    // error.
    errorFn, 
    // text.
    capitalization, 
    // match.
    extract_exp, trim_exp, comment_exp, 
    // file.
    file_name, directory, encoding, 
    // parsing.
    custom_parse_fn, string_parse_exps, array_parse_exps, object_parse_exps, number_parse_exps, bool_parse_exps, 
    // logging.
    logging, verbose, } = Object.assign(Object.assign({}, PDENV_CONFIGDEFAULTS), options);
    // clone PDENV_CONFIGDEFAULTS, since maybe pdenv is used with multiple envs.
    // set logging and verbose mode with given config options.
    m_do_logging = logging;
    m_do_verbose_logging = verbose;
    m_log(`operational. ${version}`, 'SUCCESS');
    m_log('verbose logging enabled.'); // can't log 'logging enabled.', cause INFO only logs when verbose mode is enabled.
    m_log('\n');
    m_log('this is a success.', 'SUCCESS', true);
    m_log('this is a warning.', 'WARN', true);
    m_log('this is a error.', 'ERROR', true);
    m_log('\n');
    // set error callback if provided one.
    if (errorFn)
        m_onError = errorFn;
    // resolve home directory. ( '~/Documents/' -> '/home/username/Documents/' )
    let directory_split = directory.split('/');
    let fmt_directory = directory_split[0] === '~'
        ? `${(0, os_1.homedir)()}/${directory_split.splice(1).join('/')}`
        : directory;
    // get path to .env file.
    const file_path = (0, path_1.resolve)(process.cwd(), fmt_directory, file_name);
    m_log(`file path obtained:\n\t${file_path}`);
    // check if file exists.
    if (!(0, fs_1.existsSync)(file_path))
        return m_log('unable to find file. if file exists, check read perms.', 'WARN');
    // read file.
    m_log('file found. attempting to read.');
    let file_content = [];
    try {
        file_content = (0, fs_1.readFileSync)(file_path, { encoding }).split('\n');
    }
    catch (err) {
        m_log(`not able to read file.\n\t${err}`, 'ERROR');
        return;
    }
    m_log('file content extracted.');
    // extract and parse text.
    m_log('processing extracted text...');
    file_content
        .forEach((line) => {
        // comb line-by line and regex match.
        //     if RegExpMatchArray, parse and trim.
        //     elif null, discard.
        // separate out extracted values to next step.
        // store in "process.pdenv".
        const matched_line = line.match(extract_exp);
        // return if no match found, not keeping unwanted lines.
        if (matched_line == null)
            return;
        // split at '='.
        const line_split = matched_line[0].split('=');
        // console.log(line_split);
        let line_key = line_split[0].replace(trim_exp, ''); // get, trim key.
        let line_val = line_split
            .slice(1).join('=') // get key, re-join.
            .match(comment_exp)[0] // trim comments.
            .replace(trim_exp, ''); // trim whitespace.
        // key capitalization.
        switch (capitalization) {
            case 'lowercase':
                line_key = line_key.toLowerCase();
                break;
            case 'uppercase':
                line_key = line_key.toUpperCase();
                break;
        }
        // parse values.
        line_val = m_parse(line_val, string_parse_exps, array_parse_exps, object_parse_exps, number_parse_exps, bool_parse_exps, custom_parse_fn);
        process.pdenv[line_key] = line_val;
    });
    m_log(`${capitalization} capitalization enforced on keys.`);
    m_log('trimmed, parsed, packed variables.');
    m_log('configured.', 'SUCCESS');
};
exports.config = config;
// === === === === === === === === === === === === ===
/** Calls given function when error occurs. */
const onError = (callback) => // TODO? make error-handling system.
 { m_onError = callback; };
exports.onError = onError;
// === === === === === === === === === === === === ===
/** Parses string and returns interpreted value. */
const m_parse = (data, string_parse_exps, array_parse_exps, object_parse_exps, number_parse_exps, bool_parse_exps, custom_parse_fn) => {
    // TODO if string starts with " or ' or `, then interpret as string.
    // if value ends with *, parse as string, account for escape char.
    // if starts with [, then parse as array, account for escape char.
    //  	if value in arr ends with *, parse as string, account for escape char.
    // TODO make it so there's a set of characters that represent the # symbol, replace in value if string.
    // use custom parse function if available.
    if (custom_parse_fn != undefined)
        return custom_parse_fn(string_parse_exps, array_parse_exps, object_parse_exps, number_parse_exps, bool_parse_exps);
    // use default function if no custom parse function given.
    // check if ending has asterisk with no escape character, just parse as string if so.
    let ignore_parse_search = data.slice(-2);
    if (ignore_parse_search.length > 1)
        if (ignore_parse_search != '\\*' &&
            ignore_parse_search.split('')[1] == '*')
            return data.slice(0, -1);
    // test expressions.
    let is_string = m_testAll(data, string_parse_exps);
    const is_array = m_testAll(data, array_parse_exps);
    const is_object = m_testAll(data, object_parse_exps);
    const is_number = m_testAll(data, number_parse_exps);
    const is_bool = m_testAll(data, bool_parse_exps);
    // TODO make this much better 👇
    // if the string has string characters at both the beginning and end, remove them.
    if (data.length > 1) {
        let quotes = JSON.stringify([data[0], data[data.length - 1]]);
        if (is_string)
            if (quotes == JSON.stringify(['"', '"']))
                data = data.slice(1, -1);
    }
    // default to parsing by string.
    if (!(is_string && is_array && is_object && is_number && is_bool))
        is_string = true;
    // TODO check for if multiple are true.
    if (is_number)
        return parseFloat(data);
    else if (is_bool)
        return (data.toLowerCase() == 'true');
    else if (is_array || is_object)
        return JSON.parse(data);
    else if (is_string) {
        data = unescapejs(data);
        return data;
    }
    // just in case.
    return data;
};
const m_replaceAll = (text, target, replacement) => {
    // TODO check speed? i don't remember how JS does the 'new' keyword thing, used to c++.
    if (typeof target != 'string')
        return text.replace(new RegExp(target), replacement); // string
    return text.replace(target, replacement); // RegExp
};
/** Tests an array of expressions against a string.
 * @returns {boolean} True if at least one is true, false if any is false. */
const m_testAll = (target, expressions) => {
    for (let i in expressions) {
        if (expressions[i].test(target))
            return true;
    }
    return false;
};
/** Tests if the string we're tryna parse has an asterisk, and no escape character before it.
 * @returns {boolean} */
const m_doIgnoreParse = (data) => {
    let ignore_parse_search = data.slice(-2);
    if (ignore_parse_search.length > 1)
        if (ignore_parse_search != '\\*' &&
            ignore_parse_search.split('')[1] == '*')
            return true;
    return false;
};
const m_log = (message, priority = 'INFO', dummy = false) => {
    // return if logging isn't enabled.
    if (!m_do_logging)
        return;
    // only log info if in verbose mode, only log dummy logs in verbose mode.
    if (priority == 'INFO' || dummy)
        if (!m_do_verbose_logging)
            return;
    if (message == '\n')
        return console.log('\n');
    let prio_text = '';
    switch (priority) {
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
    if (!dummy && priority == 'ERROR' && m_onError)
        m_onError(message);
};
// === === === === === === === === === === === === ===
/// EXPORTS
const pdenv = { config, onError, };
exports.default = pdenv;
//# sourceMappingURL=pdenv.js.map