import Component from "../../scripts/component.js";

window.customElements.define('web-header-nav', class extends Component {
    constructor() {
        super();
    }

    connectedCallback() {
        const toggle = this.querySelector('.toggle');
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('is-selected', !toggle.classList.contains('is-selected'));
            this.querySelector('[slot=""]')
        });

        const nestedLink = this.querySelector('[slot="menu"] li:has(ul) > a');
        nestedLink.insertAdjacentHTML('beforeend', `
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"/></svg>
        `);

        nestedLink.addEventListener('click', (event) => {
            if (event.target.closest('svg')) {
                event.preventDefault();
                nestedLink.classList.toggle('is-selected', !nestedLink.classList.contains('is-selected'));
            }
        });

        let selectedMenu = this.querySelector(`[slot="menu"] a[href="${location.pathname}"]`);
        if (selectedMenu) {
            selectedMenu.classList.add('is-selected');
        }

        const parent = selectedMenu?.closest('ul')?.closest('li');
        if (parent) {
            parent.querySelector('a').classList.add('is-selected')
        }
    }
});
