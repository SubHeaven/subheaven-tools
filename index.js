var _logger = require('debug')('teste:tools');

Array.prototype.forEachAsync = async function(fn) {
    let i = 0;
    for (let t of this) {
        await fn(t, i);
        i++;
    }
}

Array.prototype.forEachAsyncParallel = async function(fn) {
    await Promise.all(this.map(fn));
}

Number.prototype.toByteString = async function(si = false, dp = 1) {
    let bytes = this;
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


    return bytes.toFixed(dp) + ' ' + units[u];
}

exports.log = (name) => {
    let internal_log = require('debug')(name);
    return (msg) => {
        let now = new Date();
        now = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDay().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
        if (typeof msg === 'object') {
            msg = JSON.stringify(msg, null, 4);
        }
        if (typeof msg === 'string') {
            let lines = msg.split('\n');
            lines.forEach(line => {
                internal_log(`[${now}] ${line}`);
            });
        } else {
            internal_log(`[${now}] ${msg}`);
        }
    }
}

exports.init = async() => {};

exports.stack = async() => {
    let stk = new Error().stack;
    stk = stk.split('\n')[3].split('\\');
    stk = stk.pop()
    stk = stk.split(':')
    stk = `${stk[0]}[${stk[1]}]`;
    process.stdout.write(stk);
    process.stdout.write('\n');
}

exports.history = async(counter=0) => {
    let stk = new Error().stack;
    let stacks = stk.split('\n').splice(2);
    if (stacks.length > counter) stacks = stacks.splice((stacks.length - counter));
    process.stdout.write("");
    process.stdout.write('\n');
    process.stdout.write("Current stack:");
    process.stdout.write('\n');
    await stacks.forEachAsync(async stack => { 
        process.stdout.write(stack);
        process.stdout.write('\n');
    });
}

exports.debug = async function () {
    process.stdout.write("");
    process.stdout.write('\n');
    await exports.stack();
    for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === 'object') {
            process.stdout.write(JSON.stringify(arguments[i], null, 4));
            process.stdout.write('\n');
        } else {
            process.stdout.write(arguments[i].toString());
            process.stdout.write('\n');
        }
    }
}

exports.exit = async (code = 9) => {
    process.stdout.write('\n');
    await exports.stack();
    process.stdout.write(`Finalizando processo com o código ${code}`);
    process.stdout.write('\n');
    process.stdout.write('\n');
    process.exit(code);
}