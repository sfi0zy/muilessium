import Muilessium from './muilessium';

document.addEventListener('DOMContentLoaded', () => {
    window.Muilessium = new Muilessium;
    

    window.Muilessium.create('input',    '.mui-input',    {});
    window.Muilessium.create('textarea', '.mui-textarea', {});
    window.Muilessium.create('like',     '.mui-like',  {});
    window.Muilessium.create('button', '.mui-button', {});
    window.Muilessium.create('carousel', '.mui-carousel', {});
    window.Muilessium.create('piechart', '.mui-pie-chart', {});
    window.Muilessium.create('barchart', '.mui-bar-chart', {});
    window.Muilessium.create('linechart', '.mui-line-chart', {});
    window.Muilessium.create('selectdropdown', '.mui-select-dropdown', {});
    window.Muilessium.create('accordion', '.mui-accordion', {});
    window.Muilessium.create('checkbox', '.mui-checkbox', {});
    window.Muilessium.create('tabs', '.mui-tabs', {});
    window.Muilessium.create('headernavigation', '.mui-header-navigation', {});
});
