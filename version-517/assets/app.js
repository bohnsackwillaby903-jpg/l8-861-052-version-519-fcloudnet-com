(function () {
    var menuButton = document.querySelector('.mobile-menu-button');
    var mobileNav = document.querySelector('.mobile-nav');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            var isOpen = mobileNav.classList.toggle('open');
            menuButton.setAttribute('aria-expanded', String(isOpen));
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('.hero-prev');
        var next = hero.querySelector('.hero-next');
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === current);
            });

            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === current);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }

            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(current - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(current + 1);
                restart();
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
                restart();
            });
        });

        showSlide(0);
        restart();
    }

    var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-card-search]'));
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-category]'));
    var activeCategory = 'all';

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function applyFilters() {
        var query = normalize(searchInputs.map(function (input) {
            return input.value;
        }).find(Boolean) || '');
        var cards = Array.prototype.slice.call(document.querySelectorAll('.searchable-card'));

        cards.forEach(function (card) {
            var text = normalize(card.getAttribute('data-search'));
            var category = card.getAttribute('data-category') || '';
            var matchesText = !query || text.indexOf(query) !== -1;
            var matchesCategory = activeCategory === 'all' || category === activeCategory;
            card.classList.toggle('is-hidden', !(matchesText && matchesCategory));
        });
    }

    searchInputs.forEach(function (input) {
        input.addEventListener('input', applyFilters);
    });

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            activeCategory = button.getAttribute('data-filter-category') || 'all';

            filterButtons.forEach(function (item) {
                item.classList.toggle('active', item === button);
            });

            applyFilters();
        });
    });
})();
