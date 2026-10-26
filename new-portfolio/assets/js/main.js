/**
 * Dhaval Rathod — Portfolio v3
 * Theme toggle, mobile menu, header state, role rotator, scroll reveal,
 * active-section highlighting, project dialogs and Figma filters.
 */
(function () {
    'use strict';

    const root = document.documentElement;
    const body = document.body;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ===== THEME TOGGLE =====
    const themeMeta = document.querySelector('meta[name="theme-color"]');

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#0f0e0d' : '#f5f2ed');
    }

    applyTheme(root.getAttribute('data-theme') || 'light');

    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked */ }
        });
    });

    // ===== MOBILE MENU =====
    const menuBtn = document.querySelector('.menu-toggle');
    const navMenu = document.getElementById('navMenu');

    function setMenu(open) {
        body.classList.toggle('menu-open', open);
        body.style.overflow = open ? 'hidden' : '';
        if (menuBtn) {
            menuBtn.setAttribute('aria-expanded', String(open));
            menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        }
    }

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
        navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && body.classList.contains('menu-open')) {
                setMenu(false);
                menuBtn.focus();
            }
        });
        window.matchMedia('(min-width: 881px)').addEventListener('change', e => {
            if (e.matches) setMenu(false);
        });
    }

    // ===== HEADER STATE ON SCROLL =====
    const header = document.getElementById('header');
    let ticking = false;

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            if (header) header.classList.toggle('scrolled', window.scrollY > 20);
            ticking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ===== ROLE ROTATOR (typing effect) =====
    const rotator = document.getElementById('rotator');

    if (rotator && !reduceMotion) {
        const words = ['Web Designer', 'UI/UX Designer'];
        let wordIndex = 0;
        let charIndex = words[0].length;
        let deleting = true;

        function tick() {
            const word = words[wordIndex];
            charIndex += deleting ? -1 : 1;
            rotator.textContent = word.slice(0, charIndex);

            let delay = deleting ? 60 : 110;

            if (!deleting && charIndex === word.length) {
                deleting = true;
                delay = 2200;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                delay = 300;
            }

            setTimeout(tick, delay);
        }

        setTimeout(tick, 2400);
    }

    // ===== SCROLL REVEAL =====
    const revealEls = document.querySelectorAll('.reveal, .skill');

    if ('IntersectionObserver' in window && !reduceMotion) {
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => io.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('is-visible'));
    }

    // ===== ACTIVE NAV LINK =====
    const sectionLinks = navMenu ? [...navMenu.querySelectorAll('a[href^="#"]')] : [];
    const sections = sectionLinks
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);
    // Hero has no nav link; observing it clears the highlight when back at the top
    const heroSection = document.getElementById('home');
    if (heroSection) sections.push(heroSection);

    if (sections.length && 'IntersectionObserver' in window) {
        const spy = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                sectionLinks.forEach(link => {
                    const match = link.getAttribute('href') === '#' + entry.target.id;
                    link.classList.toggle('active', match);
                    if (match) link.setAttribute('aria-current', 'true');
                    else link.removeAttribute('aria-current');
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });

        sections.forEach(section => spy.observe(section));
    }

    // ===== PROJECT DIALOGS =====
    // Native <dialog> handles focus trapping, Escape and returning focus to the trigger.
    document.querySelectorAll('[data-case]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const dialog = document.getElementById(trigger.dataset.case);
            if (!dialog || typeof dialog.showModal !== 'function') return;
            dialog.showModal();
            body.style.overflow = 'hidden';
            const scroller = dialog.querySelector('.case-scroll');
            if (scroller) scroller.scrollTop = 0;
        });
    });

    document.querySelectorAll('dialog.case').forEach(dialog => {
        dialog.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', () => dialog.close()));

        // Close when clicking the backdrop (outside the dialog box)
        dialog.addEventListener('click', e => {
            if (e.target !== dialog) return;
            const r = dialog.getBoundingClientRect();
            const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
            if (!inside) dialog.close();
        });

        dialog.addEventListener('close', () => {
            body.style.overflow = '';
        });
    });

    // ===== FIGMA FILTERS =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const designCards = document.querySelectorAll('.design-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            filterBtns.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
            designCards.forEach(card => {
                const show = filter === 'all' || card.dataset.category === filter;
                card.hidden = !show;
                if (show) card.classList.add('is-visible');
            });
        });
    });

    // ===== FOOTER YEAR =====
    document.querySelectorAll('[data-year]').forEach(el => {
        el.textContent = new Date().getFullYear();
    });
})();
