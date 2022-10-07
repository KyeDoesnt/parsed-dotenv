import { resolve as resolvePath } from 'path';
import pdenv from '../../lib/pdenv';

// new line so it's easier to read logs in dev mode.
console.log('\n');

// TODO put somewhere in documentation that "source code includes a negative lookbehind, so check your target platform - but you're probably fine".
// maybe have a last-two-character search?

// configure pdenv.
pdenv.config({
	logging: true,
	verbose: true,
});

console.log(process.pdenv);