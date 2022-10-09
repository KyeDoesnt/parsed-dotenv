
# pdenv ✨

parse your `.env` file.  

![NPM_VERSION_BADGE]

-----

**disclaimer**: my formatting is shit. please try and bear with me,  
i was just tryna make something that worked.

```js
{
  'trans rights': 'human rights.',
  'black lives': 'matter.',
  'slava': 'ukraini!'
}
```

-----

**install**: how to install it.  
`npm i pdenv`

<br>

**example**: how to use it.  
```env
# .env

[CONNECTION]
HOST="127.0.0.1" # loopback
PORT=3000

[USER]
LOGIN    = { "username": "pudding", "password": "SOCKMunchy%9001" }
KEYS     = ["7EAXtdHYh6pn", "5xk91OUVAj9a", "a0CYiJ53D3ihPq"]
REMEMBER = False
```

```typescript
// main.ts

import pdenv from 'pdenv';

pdenv.config();
```

<br>

**formatting**: how to format it.  
> **string**  
> as of right now, only uses double quotes. (`"`)  
> `STRING="The quick brown fox\njumps over the lazy dog."`

> **number**  
> floating point and integer values are accepted.  
> `NUMBER=3.14`

> **boolean**  
> any capitalization accepted.  
> `BOOLEAN=true`

> **array**  
> uses the JSON.parse function.  
> has to be one line.  
> booleans have to be all lowercase.  
> nesting allowed.  
> `ARRAY=["VALUE", 9000, true]`

> **object**  
> uses the JSON.parse function.  
> has to be one line.  
> keys have to be in quotes.  
> booleans have to be all lowercase.  
> nesting allowed.  
> `OBJECT={"STRING": "VALUE", "NUMBER": 3.14, "BOOLEAN": false}`

-----

`// kye cedar :3c`  
kyedo( [twitter][KYE_TWITTER], [github][KYE_GITHUB] );



<!-- LINKS -->
[KYE_TWITTER]: https://twitter.com/kyedoart
[KYE_GITHUB]: https://github.com/kyedodev
[NPM_VERSION_BADGE]: https://img.shields.io/badge/dynamic/json?color=blue&label=version&prefix=v&query=version&url=https%3A%2F%2Fraw.githubusercontent.com%2Fkyedodev%2Fpdenv%2Fmain%2Fpackage.json&style=flat-square&logo=npm
