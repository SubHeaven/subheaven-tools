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
    _logger = require('debug')(name);
    return (msg) => {
        let now = new Date();
        now = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDay().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
        _logger(`[${now}] ${msg}`);
    }
}

exports.init = async() => {};

exports.stack = async() => {
    let stk = new Error().stack;
    stk = stk.split('\n')[3].split('\\');
    stk = stk.pop()
    stk = stk.split(':')
    stk = `${stk[0]}[${stk[1]}]`;
    console.log(stk);
}

exports.debug = async (msg) => {
    console.log("");
    await exports.stack();
    console.log(msg);
    console.log("");
}

exports.exit = async (code) => {
    console.log("");
    await exports.stack();
    console.log(`Finalizando processo com o código ${code}`);
    console.log("");
    process.exit(code);
}