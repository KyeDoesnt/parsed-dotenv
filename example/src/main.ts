import { isArray } from 'util';
import pdenv from '../../lib/pdenv';
// would be:   import pdenv from 'pdenv';

// new line so it's easier to read logs in dev mode.
console.log('\n');

// configure pdenv.
pdenv.config({
	errorFn: (err: string) => { throw err; },
	logging: true,
});



// INTERFACES
interface I_FAVOURITES
	{
		activity ?: string;
		food     ?: string;
		number   ?: number;
	}

interface I_VET_VISIT
	{
		date   : string;
		reason : string;
	}

interface I_DATA
	{
		HOST            : string;
		PORT            : number;
		USERNAME        : string;
		PASSWORD        : string;
		FAVOURITES      : I_FAVOURITES;
		VET_VISITS      : (string | I_VET_VISIT)[];
		LIKES_SCRATCHES : boolean;
	}



// ENV
const ENV_DEFAULTS =
	{
		HOST: '', PORT: 0,
		
		USERNAME: '', PASSWORD: '',
		FAVOURITES: {}, VET_VISITS: [],
		LIKES_SCRATCHES: false,
	};

// todo? in the future, make a "defaults" option in config to configure what the defaults are.
const
	{
		// INTERNET.
		HOST, PORT,
		
		// USER.
		USERNAME, PASSWORD,
		FAVOURITES, VET_VISITS,
		LIKES_SCRATCHES,
	}: I_DATA = Object.assign({...ENV_DEFAULTS}, process.pdenv);



// LOGIN
console.log('\n');

const accessInternet = (host: string, port: number): void =>
	{ console.log(`internet access obtained. ${host}:${port}`); };

const userLogin = (username: string, password: string): void =>
	{ console.log(`user has logged in. ( ${username}: ${Array(password.length + 1).join('*')} )`); };

const logData = (name: string, data: any): void =>
	{
		console.log(`\n${name} : ${Array.isArray(data) ? 'array' : typeof data} =`);
		console.log(data);
	};


accessInternet(HOST, PORT);
userLogin(USERNAME, PASSWORD);

logData('favourites', FAVOURITES);
logData('vet visits', VET_VISITS);
logData('likes scratches', LIKES_SCRATCHES);