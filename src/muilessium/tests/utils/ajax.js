require('babel-register')({
    presets: ['env']
});


// NOTICE: jsdom-global can pass options to the jsdom,
// but this feature is undocumented. Here is source code:
// https://github.com/rstacruz/jsdom-global/blob/master/index.js#L29
require('jsdom-global')('', {
    url: 'https://jsonplaceholder.typicode.com'
});



const log = require('../../../../nodeunit.config.js').log;
const   _ = require('../../utils.js').default;


module.exports = {
    post(test) {
        log.info('POST https://jsonplaceholder.typicode.com/posts');

        test.expect(1);

        // ---------------

        function callbackPositive(responseText) {
            test.equal(JSON.parse(responseText).id, 101);
            test.done();
        }

        function callbackNegative(/* status, statusText */) {
            test.ok(false, 'it seems like jsonplaceholder is down');
            test.done();
        }

        // ---------------

        _.ajax.post(
            'https://jsonplaceholder.typicode.com/posts',
            { /* data */ },
            callbackPositive,
            callbackNegative
        );
    },



    postProtected(test) {
        log.info('POST https://jsonplaceholder.typicode.com/posts');

        test.expect(1);

        // ---------------

        function callbackPositive(responseText) {
            test.equal(JSON.parse(responseText).id, 101);
            test.done();
        }

        // ---------------

        _.ajax.postProtected(
            'https://jsonplaceholder.typicode.com/posts',
            { /* data */ },
            callbackPositive
        );
    },



    get(test) {
        log.info('GET https://jsonplaceholder.typicode.com/posts');

        test.expect(1);

        // ---------------

        function callbackPositive(responseText) {
            test.equal(JSON.parse(responseText)[0].id, 1);
            test.done();
        }

        function callbackNegative(/* status, statusText */) {
            test.ok(false, 'it seems like jsonplaceholder is down');
            test.done();
        }

        // ---------------

        _.ajax.get(
            'https://jsonplaceholder.typicode.com/posts',
            callbackPositive,
            callbackNegative
        );
    },



    getProtected(test) {
        log.info('GET https://jsonplaceholder.typicode.com/posts');

        test.expect(1);

        // ---------------

        function callbackPositive(responseText) {
            test.equal(JSON.parse(responseText)[0].id, 1);
            test.done();
        }

        // ---------------

        _.ajax.getProtected(
            'https://jsonplaceholder.typicode.com/posts',
            callbackPositive
        );
    }
};

