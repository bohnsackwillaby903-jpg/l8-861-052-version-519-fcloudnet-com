(function() {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function text(value) {
    return String(value || "").toLowerCase();
  }

  ready(function() {
    var menuButton = document.getElementById("mobile-menu-button");
    var mobileNav = document.getElementById("mobile-nav");
    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function() {
        mobileNav.classList.toggle("is-open");
      });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var index = 0;
      var timer = null;
      var show = function(nextIndex) {
        if (!slides.length) {
          return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function(slide, i) {
          slide.classList.toggle("is-active", i === index);
        });
        dots.forEach(function(dot, i) {
          dot.classList.toggle("is-active", i === index);
        });
      };
      var schedule = function() {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function() {
          show(index + 1);
        }, 5000);
      };
      dots.forEach(function(dot, i) {
        dot.addEventListener("click", function() {
          show(i);
          schedule();
        });
      });
      if (prev) {
        prev.addEventListener("click", function() {
          show(index - 1);
          schedule();
        });
      }
      if (next) {
        next.addEventListener("click", function() {
          show(index + 1);
          schedule();
        });
      }
      schedule();
    }

    var localSearch = document.querySelector("[data-local-search]");
    var localType = document.querySelector("[data-local-type]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
    var filterCards = function() {
      var query = localSearch ? text(localSearch.value) : "";
      var typeValue = localType ? text(localType.value) : "";
      cards.forEach(function(card) {
        var haystack = text(card.getAttribute("data-title"));
        var cardType = text(card.getAttribute("data-type"));
        var matched = (!query || haystack.indexOf(query) !== -1) && (!typeValue || cardType.indexOf(typeValue) !== -1);
        card.classList.toggle("is-filter-hidden", !matched);
      });
    };
    if (localSearch) {
      localSearch.addEventListener("input", filterCards);
    }
    if (localType) {
      localType.addEventListener("change", filterCards);
    }

    var searchForm = document.getElementById("global-search-form");
    var searchInput = document.getElementById("global-search-input");
    var searchPanel = document.getElementById("global-search-panel");
    var renderSearch = function() {
      if (!searchInput || !searchPanel || typeof SEARCH_MOVIES === "undefined") {
        return [];
      }
      var query = text(searchInput.value).trim();
      if (!query) {
        searchPanel.classList.remove("is-open");
        searchPanel.innerHTML = "";
        return [];
      }
      var results = SEARCH_MOVIES.filter(function(movie) {
        return text(movie.title + " " + movie.year + " " + movie.region + " " + movie.genre + " " + movie.type).indexOf(query) !== -1;
      }).slice(0, 8);
      searchPanel.innerHTML = results.map(function(movie) {
        return '<a class="search-result" href="' + movie.url + '">' +
          '<img src="' + movie.cover + '" alt="' + movie.title.replace(/"/g, "&quot;") + '" />' +
          '<span><strong>' + movie.title + '</strong><span>' + movie.year + ' · ' + movie.region + ' · ' + movie.genre + '</span></span>' +
          '</a>';
      }).join("");
      searchPanel.classList.toggle("is-open", results.length > 0);
      return results;
    };
    if (searchInput) {
      searchInput.addEventListener("input", renderSearch);
      document.addEventListener("click", function(event) {
        if (searchForm && !searchForm.contains(event.target)) {
          searchPanel.classList.remove("is-open");
        }
      });
    }
    if (searchForm) {
      searchForm.addEventListener("submit", function(event) {
        event.preventDefault();
        var results = renderSearch();
        if (results.length) {
          window.location.href = results[0].url;
        }
      });
    }
  });
})();

window.initMoviePlayer = function(videoId, coverId, buttonId, streamUrl) {
  var video = document.getElementById(videoId);
  var cover = document.getElementById(coverId);
  var button = document.getElementById(buttonId);
  var hlsInstance = null;
  var started = false;

  if (!video || !streamUrl) {
    return;
  }

  var hideCover = function() {
    if (cover) {
      cover.classList.add("is-hidden");
    }
  };

  var showCover = function() {
    if (cover && video.paused) {
      cover.classList.remove("is-hidden");
    }
  };

  var bindStream = function() {
    if (started) {
      return;
    }
    started = true;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
      hlsInstance.on(window.Hls.Events.ERROR, function(eventName, data) {
        if (data && data.fatal) {
          video.setAttribute("data-player-state", "error");
        }
      });
      return;
    }
    video.src = streamUrl;
  };

  var playVideo = function() {
    bindStream();
    hideCover();
    var playTask = video.play();
    if (playTask && typeof playTask.catch === "function") {
      playTask.catch(function() {
        showCover();
      });
    }
  };

  if (cover) {
    cover.addEventListener("click", playVideo);
  }
  if (button) {
    button.addEventListener("click", playVideo);
  }
  video.addEventListener("click", function() {
    if (video.paused) {
      playVideo();
    }
  });
  video.addEventListener("play", hideCover);
  video.addEventListener("pause", showCover);
  video.addEventListener("ended", showCover);
};
