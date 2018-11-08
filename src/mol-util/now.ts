/**
 * Copyright (c) 2017 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author David Sehnal <david.sehnal@gmail.com>
 */

declare var process: any;
declare var window: any;

const now: () => now.Timestamp = (function () {
    if (typeof window !== 'undefined' && window.performance) {
        const perf = window.performance;
        return () => perf.now();
    } else if (typeof process !== 'undefined' && process.hrtime !== 'undefined') {
        return () => {
            const t = process.hrtime();
            return t[0] * 1000 + t[1] / 1000000;
        };
    } else if (Date.now) {
        return () => Date.now();
    } else {
        return () => +new Date();
    }
}());

namespace now {
    export type Timestamp = number & { '@type': 'now-timestamp' }
}

export { now }