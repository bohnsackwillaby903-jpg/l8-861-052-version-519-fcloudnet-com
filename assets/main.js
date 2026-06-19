(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-main-nav]");
    if (menuButton && nav) {
      menuButton.addEventListener("click", function () {
        nav.classList.toggle("open");
      });
    }

    document.querySelectorAll("img").forEach(function (img) {
      img.addEventListener("error", function () {
        img.classList.add("image-missing");
      }, { once: true });
    });

    document.querySelectorAll("[data-hero]").forEach(function (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var index = 0;
      var timer = null;

      function show(next) {
        if (!slides.length) {
          return;
        }
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("active", i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("active", i === index);
        });
      }

      function start() {
        if (timer) {
          clearInterval(timer);
        }
        timer = setInterval(function () {
          show(index + 1);
        }, 5200);
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          show(i);
          start();
        });
      });

      show(0);
      start();
    });

    document.querySelectorAll("[data-filter-panel]").forEach(function (panel) {
      var input = panel.querySelector("#catalog-search");
      var region = panel.querySelector("#region-filter");
      var year = panel.querySelector("#year-filter");
      var type = panel.querySelector("#type-filter");
      var reset = panel.querySelector("[data-reset-filter]");
      var counter = panel.querySelector("[data-result-counter]");
      var root = panel.parentElement || document;
      var cards = Array.prototype.slice.call(root.querySelectorAll("[data-filter-card]"));
      var empty = root.querySelector("[data-empty-state]");
      var params = new URLSearchParams(window.location.search);
      var q = params.get("q") || "";

      if (input && q) {
        input.value = q;
      }

      function contains(value, needle) {
        return String(value || "").toLowerCase().indexOf(needle) !== -1;
      }

      function apply() {
        var keyword = input ? input.value.trim().toLowerCase() : "";
        var regionValue = region ? region.value : "";
        var yearValue = year ? year.value : "";
        var typeValue = type ? type.value : "";
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = [
            card.dataset.title,
            card.dataset.region,
            card.dataset.year,
            card.dataset.type,
            card.dataset.genre,
            card.dataset.tags,
            card.textContent
          ].join(" ").toLowerCase();
          var ok = true;

          if (keyword && haystack.indexOf(keyword) === -1) {
            ok = false;
          }
          if (regionValue && card.dataset.region !== regionValue) {
            ok = false;
          }
          if (yearValue && card.dataset.year !== yearValue) {
            ok = false;
          }
          if (typeValue && card.dataset.type !== typeValue) {
            ok = false;
          }

          card.style.display = ok ? "" : "none";
          if (ok) {
            visible += 1;
          }
        });

        if (counter) {
          counter.textContent = visible ? "匹配到 " + visible + " 部影片" : "没有匹配内容";
        }
        if (empty) {
          empty.classList.toggle("visible", visible === 0);
        }
      }

      [input, region, year, type].forEach(function (el) {
        if (el) {
          el.addEventListener("input", apply);
          el.addEventListener("change", apply);
        }
      });

      if (reset) {
        reset.addEventListener("click", function () {
          if (input) {
            input.value = "";
          }
          if (region) {
            region.value = "";
          }
          if (year) {
            year.value = "";
          }
          if (type) {
            type.value = "";
          }
          apply();
        });
      }

      apply();
    });

    document.querySelectorAll("[data-player]").forEach(function (player) {
      var video = player.querySelector("video[data-stream]");
      var button = player.querySelector("[data-play-button]");
      var hls = null;
      var bound = false;

      function bindStream() {
        if (!video || bound) {
          return;
        }
        var stream = video.dataset.stream;
        if (!stream) {
          return;
        }
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
          bound = true;
          return;
        }
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(stream);
          hls.attachMedia(video);
          bound = true;
          return;
        }
        video.src = stream;
        bound = true;
      }

      function play() {
        bindStream();
        if (!video) {
          return;
        }
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {});
        }
      }

      if (button) {
        button.addEventListener("click", function (event) {
          event.preventDefault();
          play();
        });
      }

      if (video) {
        video.addEventListener("click", function () {
          if (video.paused) {
            play();
          }
        });
        video.addEventListener("play", function () {
          if (button) {
            button.classList.add("is-hidden");
          }
        });
        video.addEventListener("pause", function () {
          if (button && video.currentTime === 0) {
            button.classList.remove("is-hidden");
          }
        });
        video.addEventListener("ended", function () {
          if (button) {
            button.classList.remove("is-hidden");
          }
        });
      }
    });
  });
})();
