module.exports = {
    ignore: [
        'viewport-units',   // Only vmax isn't supported in IE11.
        'outline',          // IE11 has partial support of it.
        'css-resize',       // IE, Edge, iOS Safari and Opera Mini don't support it.
        'user-select-none', // Mobile browsers have some issues with it, it's ok.
        'pointer-events',   // This rule related to the specification, not the "pointer-events" CSS property.
        'css-appearance',   // All browsers have partial support of this thing.
        'will-change',      // Some browsers don't support it, it's ok.
        'object-fit',       // Muilessium uses polyfill.
        'calc'              // If browser doesn't support viewport units in calc, it's not very horrible.
    ],


    onFeatureUsage(info) {
        const selector = info.usage.parent.selector;
        const property = `${info.usage.prop}: ${info.usage.value}`;

        let status   = info.featureData.caniuseData.status.toUpperCase();


        if (info.featureData.missing) {
            status = '\x1b[31mNOT SUPPORTED\x1b[0m';
        } else if (info.featureData.partial) {
            status = '\x1b[33mPARTIAL SUPPORT\x1b[0m';
        }

        console.log(`\n${status}:\n\n    ${selector} {\n        ${property};\n    }\n`);
    }
};

