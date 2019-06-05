// -----------------------------------------------------------------------------
// UTILITIES INDEX
// -----------------------------------------------------------------------------


import ajax               from './utils/ajax';
import aria               from './utils/aria';

import * as attributes    from './utils/attributes';
import * as checks        from './utils/checks';
import * as classes       from './utils/classes';
import * as console       from './utils/console';
import * as focusAndClick from './utils/focus-and-click';
import * as scroll        from './utils/scroll';
import * as uncategorized from './utils/uncategorized';
import * as viewport      from './utils/viewport';


// -----------------------------------------------------------------------------


const UTILS = uncategorized.extend(
    {},
    { ajax },
    { aria },
    attributes,
    checks,
    classes,
    console,
    focusAndClick,
    scroll,
    uncategorized,
    viewport
);

export default UTILS;

