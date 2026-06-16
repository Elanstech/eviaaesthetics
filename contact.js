/* =============================================================================
   CONTACT.JS — Eviaesthetics
   Page-specific: gently highlight the form card when the user jumps to it
   via a #contact-form link. Everything else runs off the shared script.js.
============================================================================= */
(function () {
    'use strict';

    const card = document.querySelector('.ct-form-card');
    if (!card) return;

    const flash = () => {
        card.classList.add('ct-flash');
        setTimeout(() => card.classList.remove('ct-flash'), 1400);
    };

    // Any link pointing at the form section
    document.querySelectorAll('a[href$="#contact-form"], a[href="#contact-form"]').forEach(a => {
        a.addEventListener('click', () => setTimeout(flash, 600)); // after the smooth scroll settles
    });

    // Also flash if the page is loaded with #contact-form already in the URL
    if (window.location.hash === '#contact-form') {
        window.addEventListener('load', () => setTimeout(flash, 500));
    }

    // Inject the flash style once (keeps it self-contained)
    if (!document.getElementById('ct-flash-style')) {
        const s = document.createElement('style');
        s.id = 'ct-flash-style';
        s.textContent =
            '.ct-form-card{transition:box-shadow .5s ease,border-color .5s ease;}' +
            '.ct-form-card.ct-flash{border-color:var(--orange);' +
            'box-shadow:0 0 0 3px rgba(255,107,0,.15),var(--shadow-md);}';
        document.head.appendChild(s);
    }
})();
