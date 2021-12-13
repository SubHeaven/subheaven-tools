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

exports.stack = async(size=1, clear=false) => {
    let base_list = new Error().stack;
    base_list = base_list.split('\n');
    let lista = [];
    for (i=0;i<base_list.length-1;i++) {
        if (base_list[i].indexOf('(') > -1) {
            line = base_list[i].split('(')[1].split(')')[0];
        } else if (base_list[i].indexOf('at ') > -1) {
            line = base_list[i].split('at ')[1];
        } else {
            line = base_list[i];
        }
        if (line.length >= 9 && line.substr(0, 9) !== 'internal/') {
            lista.push(line)
        }
    }
    
    lista = lista.reverse();
    let comma = '';
    if (!clear) {
        process.stdout.write("Current stack:");
        process.stdout.write('\n');
        comma = '    ';
    }
    lista.pop()
    let start = 0;
    if (size < lista.length) {
        start = lista.length - size;
    }

    for (i=start;i<lista.length;i++) {
        process.stdout.write(`${comma}${lista[i]}`);
        process.stdout.write('\n');
    }
}

exports.debug = async function () {
    process.stdout.write("");
    process.stdout.write('\n');
    await exports.stack(1, clear=true);
    for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === 'object') {
            process.stdout.write(JSON.stringify(arguments[i], null, 4));
            process.stdout.write('\n');
        } else if (typeof arguments[i] === 'undefined') {
            process.stdout.write('undefined');
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