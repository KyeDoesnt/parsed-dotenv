import pdenv from '../../lib/pdenv';
// would be:   import pdenv from 'pdenv';

// new line so it's easier to read logs in dev mode.
console.log('\n');

// configure pdenv.
pdenv.config({
	errorFn: (err: string) => { throw err; },
	logging: true,
	verbose: true,
});

const EXAMPLE_DEFAULTS =
	{
		NUMBER_EXAMPLE  : 96,
		STRING_EXAMPLE  : 'The dog jumps the lazy fox,\noh how the turns have tabled.',
		ARRAY_EXAMPLE   : [ 'there are two items in this array', 1, 'that was a lie' ],
		BOOLEAN_EXAMPLE : false,
		SUSSY_EXAMPLE   : { look_at_this_funny_crewmate: 'ඞ' },
	};

// todo in the future, make a "defaults" option in config to configure what the defaults are.
const { NUMBER_EXAMPLE, STRING_EXAMPLE, ARRAY_EXAMPLE, BOOLEAN_EXAMPLE, SUSSY_EXAMPLE } =
	Object.assign({...EXAMPLE_DEFAULTS}, process.pdenv);

// log the values.
console.log(NUMBER_EXAMPLE);
console.log(`${typeof NUMBER_EXAMPLE}\n`);

console.log(STRING_EXAMPLE);
console.log(`${typeof STRING_EXAMPLE}\n`);

console.log(ARRAY_EXAMPLE);
console.log(`${typeof ARRAY_EXAMPLE}\n`);

console.log(BOOLEAN_EXAMPLE);
console.log(`${typeof BOOLEAN_EXAMPLE}\n`);

console.log(SUSSY_EXAMPLE);
console.log(`${typeof SUSSY_EXAMPLE}`);