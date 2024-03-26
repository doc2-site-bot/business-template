import Component from "../../scripts/component.js";

window.customElements.define('web-cards', class extends Component {
    constructor() {
        super();
    }

    connectedCallback() {
        this.querySelectorAll('web-cards-item h3').forEach((heading, i) => {
            heading.insertAdjacentHTML('beforebegin', `<div>0${i + 1}</div>`);
        });
    }
});
