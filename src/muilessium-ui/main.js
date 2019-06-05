// -----------------------------------------------------------------------------
// MAIN
// -----------------------------------------------------------------------------


document.addEventListener('DOMContentLoaded', () => {
    if (!window.Muilessium) {
        console.log('Muilessium is not defined. Include muilessium.min.js before this.');
    }

    const FACTORY = window.Muilessium.FACTORY;
    const _       = window.Muilessium.UTILS;

    function addComponents() {
        const components = require('./components/index').default;

        _.forEach(Object.keys(components), (type) => {
            FACTORY.registerComponent(type, components[type]);
            FACTORY.create(type, `.mui-${_.toLispCase(type)}`, {});
        });
    }


    function addUtils() {
        const utils = require('./utils').default;

        window.Muilessium.UTILS = _.extend(_, utils);
    }


    addComponents();
    addUtils();
});

