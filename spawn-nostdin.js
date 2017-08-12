#!/usr/bin/env node
const crossSpawn = require('cross-spawn');

// Workaround for fastcgi thinking that stdin in a FastCGId because
// parent node process opened a pipe() with it. Using 'ignore' causes
// it to not think that, and it has no stdin anyway, so yay!
crossSpawn(process.argv[2], process.argv.slice(3), {
    stdio: [ 'ignore', 'inherit', 'inherit', ],
})
    .on('exit', code => process.exitCode = code)
;
