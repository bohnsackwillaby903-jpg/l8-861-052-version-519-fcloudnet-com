(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var menuButton = document.querySelector(".mobile-menu-button");
        var mobileMenu = document.querySelector(".mobile-menu");

        if (menuButton && mobileMenu) {
            menuButton.addEventListener("click", function () {
                var isOpen = mobileMenu.classList.toggle("open");
                menuButton.setAttribute("aria-expanded", String(isOpen));
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        var current = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === current);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                var index = Number(dot.getAttribute("data-slide"));
                showSlide(index);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(current + 1);
            }, 5600);
        }

        var searchInputs = Array.prototype.slice.call(document.querySelectorAll(".js-search"));

        searchInputs.forEach(function (input) {
            var scope = input.closest("main") || document;
            var cards = Array.prototype.slice.call(scope.querySelectorAll(".js-filter-card"));
            var count = scope.querySelector(".js-result-count");

            function filterCards() {
                var keyword = input.value.trim().toLowerCase();
                var visible = 0;

                cards.forEach(function (card) {
                    var haystack = [
                        card.getAttribute("data-title") || "",
                        card.getAttribute("data-meta") || "",
                        card.textContent || ""
                    ].join(" ").toLowerCase();
                    var matched = !keyword || haystack.indexOf(keyword) !== -1;

                    card.classList.toggle("is-hidden-card", !matched);

                    if (matched) {
                        visible += 1;
                    }
                });

                if (count) {
                    count.textContent = String(visible);
                }
            }

            input.addEventListener("input", filterCards);
            filterCards();
        });

        Array.prototype.slice.call(document.querySelectorAll("img")).forEach(function (image) {
            image.addEventListener("error", function () {
                image.classList.add("is-hidden");
            });
        });
    });
})();
