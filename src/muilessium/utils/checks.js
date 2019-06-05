// -----------------------------------------------------------------------------
// CHECKS
// -----------------------------------------------------------------------------
//
//  - isNode(element)
//  - isInPage(element)
//  - isNotInPage(element)
//  - ifExists(element, callback)
//  - ifNodeList(element, callback)
//  - isDescendant(parent, child)
//
// -----------------------------------------------------------------------------



// Is Node
// -------
// Returns true if element is Node and false otherwise

export function isNode(element) {
    return (element instanceof Node);
}



// Is in page
// ----------
// Returns true if elements exists in a document.body and false otherwise

export function isInPage(element) {
    /* Use this instead of document.contains because IE
       has only partial support of Node.contains. */
    return isNode(element) && ((element === document.body) || document.body.contains(element));
}



// Is not in page
// --------------
// Returns false if element exists in a document.body and true otherwise

export function isNotInPage(element) {
    return !isInPage(element);
}



// If exists
// ---------
// Executes callback function if the element exists in document.body
// and prints warning otherwise by default

export function ifExists(element, callback) {
    if (isInPage(element)) {
        return callback();
    }

    return null;
}



// If nodelist
// -----------
// If the first parameter is NodeList or HTMLCollection or Array of HTMLElements
// executes callback function and prints warning otherwise by default

export function ifNodeList(x, callback) {
    if (((x instanceof NodeList) || (x instanceof HTMLCollection)) && (x.length > 0)) {
        return callback();
    } else if ((x instanceof Array) && (x.length) > 0) {
        const isArrayOfElements = x.every((element) => {
            return (element instanceof HTMLElement);
        });

        if (isArrayOfElements) {
            return callback();
        }
    }

    return null;
}



// Is descendant
// -------------
// Returns true if the second element is a descendant of the first element and false otherwise

export function isDescendant(parent, child) {
    let result = false;

    ifExists(parent, () => {
        ifExists(child, () => {
            let node = child.parentNode;

            while (node != null) {
                if (node === parent) {
                    result = true;
                }

                node = node.parentNode;
            }
        });
    });

    return result;
}

