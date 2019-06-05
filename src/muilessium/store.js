// -----------------------------------------------------------------------------
// GLOBAL STORE
// -----------------------------------------------------------------------------


import EVENTS from './events';

import { deepGet } from './utils/uncategorized';
import { deepSet } from './utils/uncategorized';


class Store {
    constructor() {
        this.data = {};

        EVENTS.addEvent('store-updated');
    }

    set(path, data) {
        const result = deepSet(this.data, path, data);

        EVENTS.fireEvent('store-updated');

        return result;
    }

    get(path, data) {
        return deepGet(this.data, path);
    }
}


// -----------------------------------------------------------------------------


const STORE = new Store();

export default STORE;

