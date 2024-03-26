import Component from "../../scripts/component.js";
import {assignLinkElement} from "../../scripts/scripts.js";

window.customElements.define('web-columns-item', class extends Component {
    constructor() {
        super();
    }

    connectedCallback() {
        assignLinkElement(this);
    }
});
