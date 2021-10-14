export default await (async() => {
    let stack = async() => {
        let stk = new Error().stack;
        stk = stk.split('\n')[3].split('\\');
        stk = stk.pop()
        stk = stk.split(':')
        stk = `${stk[0]}[${stk[1]}]`;
        console.log(stk);
    }

    let debug = async (msg) => {
        console.log("");
        await stack();
        console.log(msg);
        console.log("");
    }

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

    const index = {
        init: async() => {},
        debug: debug

    }

    return index;
})();