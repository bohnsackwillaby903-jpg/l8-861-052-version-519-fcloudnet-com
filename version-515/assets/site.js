(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var slider = document.querySelector('[data-hero-slider]');

    if (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, itemIndex) {
                slide.classList.toggle('is-active', itemIndex === current);
            });

            dots.forEach(function (dot, itemIndex) {
                dot.classList.toggle('is-active', itemIndex === current);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
            });
        });

        window.setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));

    scopes.forEach(function (scope) {
        var query = scope.querySelector('[data-filter-query]');
        var year = scope.querySelector('[data-filter-year]');
        var region = scope.querySelector('[data-filter-region]');
        var genre = scope.querySelector('[data-filter-genre]');
        var reset = scope.querySelector('[data-filter-reset]');
        var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
        var empty = scope.querySelector('[data-filter-empty]');

        function includesText(value, keyword) {
            return String(value || '').toLowerCase().indexOf(keyword) !== -1;
        }

        function applyFilter() {
            var keyword = query ? query.value.trim().toLowerCase() : '';
            var selectedYear = year ? year.value : '';
            var selectedRegion = region ? region.value : '';
            var selectedGenre = genre ? genre.value : '';
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-tags'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-year')
                ].join(' ').toLowerCase();
                var matched = true;

                if (keyword && haystack.indexOf(keyword) === -1) {
                    matched = false;
                }

                if (selectedYear && card.getAttribute('data-year') !== selectedYear) {
                    matched = false;
                }

                if (selectedRegion && card.getAttribute('data-region') !== selectedRegion) {
                    matched = false;
                }

                if (selectedGenre && !includesText(card.getAttribute('data-genre'), selectedGenre)) {
                    matched = false;
                }

                card.style.display = matched ? '' : 'none';

                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.style.display = visible ? 'none' : 'block';
            }
        }

        [query, year, region, genre].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilter);
                control.addEventListener('change', applyFilter);
            }
        });

        if (reset) {
            reset.addEventListener('click', function () {
                [query, year, region, genre].forEach(function (control) {
                    if (control) {
                        control.value = '';
                    }
                });

                applyFilter();
            });
        }
    });
}());
