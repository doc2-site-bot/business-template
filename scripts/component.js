// Source: https://developer.chrome.com/en/articles/declarative-shadow-dom/
export default class Component extends HTMLElement {
    constructor() {
        super();

        const template = this.querySelector(":scope > template[shadowrootmode]");
        if (template) {
            const shadowRoot = this.shadowRoot || this.attachShadow({ mode: "open" });
            shadowRoot.appendChild(template.content);
            template.remove();
        }
    }
}
