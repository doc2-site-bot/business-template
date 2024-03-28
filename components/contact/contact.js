import Component from "../../scripts/component.js";

window.customElements.define('web-contact', class extends Component {
    constructor() {
        super();

        const key = document.head.querySelector('meta[name="gmaps"]')?.content;
        const address = document.head.querySelector('meta[name="address"]')?.content;

        if (key && address) {
            const iframe = this.querySelector('.maps iframe');
            iframe.src = `https://www.google.com/maps/embed/v1/place?key=${key}&q=${address.replaceAll(" ", "+")}&language=${document.documentElement.lang}`;
        }

        const requests = document.head.querySelector('meta[name="requests"]')?.content;
        if (requests) {
            const form = this.querySelector('form');
            const button = form.querySelector('button[type="submit"]');
            form.onsubmit = async (event) => {
                event.preventDefault();

                button.disabled = true;

                const formData = new FormData(form);
                const req = await fetch(`https://api.doc2.site/v1/spreadsheets/${new URL(requests).pathname.split('/').slice(-2).join('/')}`, {
                    headers: {
                        'content-type': 'application/json'
                    },
                    method: 'PATCH',
                    body: JSON.stringify({
                        'cf-turnstile-response': formData.get('cf-turnstile-response'),
                        operation: 'append',
                        rows: [{
                            name: formData.get('name'),
                            email: formData.get('email'),
                            tel: formData.get('tel'),
                            message: formData.get('message'),
                            date: new Date().toISOString()
                        }]
                    }),
                });

                if (req.ok) {
                    form.querySelector('.success').hidden = false;
                }

                button.disabled = false;
            }

            window.onloadTurnstileCallback = function () {
                window.turnstile.render('.cf-turnstile', {
                    callback: function(token) {
                        form.insertAdjacentHTML('beforeend', `<input type="hidden" name="cf-turnstile-response" value="${token}"/>`);
                    },
                });
            };

            // Load turnstile
            const script = document.createElement('script');
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onloadTurnstileCallback';
            document.head.append(script);
        }
    }
});
