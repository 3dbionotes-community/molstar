/**
 * Copyright (c) 2018 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author David Sehnal <david.sehnal@gmail.com>
 */

import { StateObject } from './object';
import { Transform } from './transform';
import { RxEventHelper } from 'mol-util/rx-event-helper';

export { StateContext }

class StateContext {
    private ev = RxEventHelper.create();

    events = {
        object: {
            stateChanged: this.ev<{ ref: Transform.Ref }>(),
            propsChanged: this.ev<{ ref: Transform.Ref, newProps: unknown }>(),

            updated: this.ev<{ ref: Transform.Ref, obj?: StateObject }>(),
            replaced: this.ev<{ ref: Transform.Ref, oldObj?: StateObject, newObj?: StateObject }>(),
            created: this.ev<{ ref: Transform.Ref, obj: StateObject }>(),
            removed: this.ev<{ ref: Transform.Ref, obj?: StateObject }>(),
        },
        warn: this.ev<string>()
    };

    readonly globalContext: unknown;
    readonly defaultObjectProps: unknown;

    dispose() {
        this.ev.dispose();
    }

    constructor(params: { globalContext: unknown, defaultObjectProps: unknown }) {
        this.globalContext = params.globalContext;
        this.defaultObjectProps = params.defaultObjectProps;
    }
}