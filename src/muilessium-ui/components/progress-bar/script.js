// -----------------------------------------------------------------------------
// PROGRESS BAR
// -----------------------------------------------------------------------------


const FACTORY     = window.Muilessium.FACTORY;
const _           = window.Muilessium.UTILS;


export default class ProgressBar extends FACTORY.BaseComponent {
    constructor(element, options) {
        super(element, options);

        this.domCache = _.extend(this.domCache, {
            indicator: element.querySelector('.indicator'),
            value: element.querySelector('.value')
        });

        this.state = _.extend(this.state, {
            isRadial: _.hasClass(element, '-radial'),
            value: parseInt(_.getAttribute(element, 'data-value', 0), 10)
        });

        if (this.state.isRadial) {
            this.domCache.indicator = this.domCache.indicator.querySelector('.progress');
            this.state.radialRadius = _.getAttribute(this.domCache.indicator, 'r', 10);
        }

        this.setValue(this.state.value);
    }


    restoreState() {
        if (!this.savedStates.isEmpty()) {
            const oldState = JSON.parse(this.savedStates.pop());

            this.setValue(oldState.value);
        }

        return this;
    }


    setValue(newValue) {
        let sign = 1;

        if (newValue < this.state.value) {
            sign = -1;
        }

        const update = () => {
            this.domCache.value.innerText = `${this.state.value}%`;

            if (this.state.isRadial) {
                const dasharray  = 2 * Math.PI * this.state.radialRadius;
                const dashoffset = (this.state.value * dasharray) / 100;

                this.domCache.indicator.style.strokeDashoffset = dasharray - dashoffset;
            } else {
                this.domCache.indicator.style.width = `${this.state.value}%`;
            }


            if (((sign > 0) && (this.state.value < newValue)) ||
                ((sign < 0) && (this.state.value > newValue))) {
                this.state.value += sign;

                requestAnimationFrame(update);
            }
        };

        update();
    }


    getValue() {
        return this.state.value;
    }
}

