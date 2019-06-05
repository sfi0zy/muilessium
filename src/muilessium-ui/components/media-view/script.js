// -----------------------------------------------------------------------------
// MEDIA VIEW
// -----------------------------------------------------------------------------


const FACTORY     = window.Muilessium.FACTORY;
const _           = window.Muilessium.UTILS;


export default class MediaView extends FACTORY.BaseComponent {
    constructor(element, options) {
        super(element, options);

        this.domCache = _.extend(this.domCache, {
            media:       element.querySelector('.media'),
            description: element.querySelector('.description')
        });

        this.initAria();
    }

    initAria() {
        _.aria.set(this.domCache.media, 'describedby', _.aria.setId(this.domCache.description));

        return this;
    }
}

