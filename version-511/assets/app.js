(function () {
  var body = document.body;
  var menuToggle = document.querySelector(".menu-toggle");

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      body.classList.toggle("nav-open");
    });
  }

  var topButton = document.querySelector(".back-to-top");

  if (topButton) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        topButton.classList.add("is-visible");
      } else {
        topButton.classList.remove("is-visible");
      }
    });

    topButton.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  var slider = document.querySelector("[data-hero-slider]");

  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
    var index = 0;

    var showSlide = function (nextIndex) {
      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    };

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        showSlide(dotIndex);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }
  }

  var searchPage = document.querySelector("[data-search-page]");

  if (searchPage) {
    var input = searchPage.querySelector("[data-search-input]");
    var buttons = Array.prototype.slice.call(searchPage.querySelectorAll(".filter-btn"));
    var cards = Array.prototype.slice.call(searchPage.querySelectorAll(".movie-card"));
    var count = searchPage.querySelector("[data-search-count]");
    var activeFilter = "";

    var applySearch = function () {
      var keyword = input ? input.value.trim().toLowerCase() : "";
      var visible = 0;

      cards.forEach(function (card) {
        var text = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
        var category = card.getAttribute("data-category") || "";
        var matchedKeyword = keyword === "" || text.indexOf(keyword) !== -1;
        var matchedFilter = activeFilter === "" || category === activeFilter;
        var matched = matchedKeyword && matchedFilter;

        card.classList.toggle("is-hidden", !matched);

        if (matched) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = "共 " + visible + " 部影片";
      }
    };

    if (input) {
      input.addEventListener("input", applySearch);
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        buttons.forEach(function (item) {
          item.classList.remove("is-active");
        });

        button.classList.add("is-active");
        activeFilter = button.getAttribute("data-filter") || "";
        applySearch();
      });
    });
  }

  var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));

  players.forEach(function (player) {
    var video = player.querySelector("video");
    var sourceNode = video ? video.querySelector("source") : null;
    var start = player.querySelector(".player-start");
    var loaded = false;

    var loadVideo = function () {
      if (!video || loaded) {
        return;
      }

      loaded = true;
      var source = sourceNode ? sourceNode.src : video.currentSrc;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true });
        hls.loadSource(source);
        hls.attachMedia(video);
        video.hlsInstance = hls;
      } else {
        video.src = source;
      }

      video.controls = true;
    };

    var playVideo = function () {
      loadVideo();
      player.classList.add("is-playing");

      if (video) {
        var promise = video.play();

        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {
            player.classList.remove("is-playing");
          });
        }
      }
    };

    if (start) {
      start.addEventListener("click", playVideo);
    }

    if (video) {
      video.addEventListener("click", function () {
        if (!loaded || video.paused) {
          playVideo();
        }
      });
    }
  });
})();
