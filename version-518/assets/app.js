(function () {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  const heroSlides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const heroDots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  let heroIndex = 0;

  function showHeroSlide(index) {
    if (!heroSlides.length) {
      return;
    }

    heroIndex = (index + heroSlides.length) % heroSlides.length;

    heroSlides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === heroIndex);
    });

    heroDots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === heroIndex);
    });
  }

  if (heroSlides.length) {
    heroDots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showHeroSlide(dotIndex);
      });
    });

    showHeroSlide(0);

    setInterval(function () {
      showHeroSlide(heroIndex + 1);
    }, 5600);
  }

  window.setupMoviePlayer = function (streamUrl, videoId, buttonId, layerId) {
    const video = document.getElementById(videoId);
    const button = document.getElementById(buttonId);
    const layer = document.getElementById(layerId);
    let loaded = false;

    if (!video || !button || !layer || !streamUrl) {
      return;
    }

    function startVideo() {
      layer.classList.add('is-hidden');

      if (!loaded) {
        loaded = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = streamUrl;
          video.play();
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(streamUrl);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play();
          });
          return;
        }

        video.src = streamUrl;
      }

      video.play();
    }

    button.addEventListener('click', startVideo);
    layer.addEventListener('click', startVideo);
    video.addEventListener('click', function () {
      if (video.paused) {
        startVideo();
      }
    });
  };

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (item) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[item];
    });
  }

  function renderSearchResults() {
    const resultsBox = document.getElementById('search-results');
    const input = document.getElementById('search-input');
    const state = document.getElementById('search-state');

    if (!resultsBox || !input || !state || !window.SEARCH_MOVIES) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const query = (params.get('q') || '').trim();
    input.value = query;

    if (!query) {
      state.textContent = '输入片名、地区、类型或标签，快速发现想看的内容。';
      resultsBox.innerHTML = '';
      return;
    }

    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const results = window.SEARCH_MOVIES.filter(function (movie) {
      const text = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.tags, movie.oneLine].join(' ').toLowerCase();
      return words.every(function (word) {
        return text.indexOf(word) !== -1;
      });
    }).slice(0, 96);

    if (!results.length) {
      state.textContent = '暂未找到匹配内容，可以尝试更短的关键词。';
      resultsBox.innerHTML = '';
      return;
    }

    state.textContent = '相关影片如下，点击卡片进入详情页。';
    resultsBox.innerHTML = results.map(function (movie) {
      return [
        '<article class="movie-card">',
        '  <a class="poster-link" href="' + escapeHtml(movie.url) + '" aria-label="' + escapeHtml(movie.title) + '">',
        '    <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
        '    <span class="poster-shade"></span>',
        '    <span class="year-badge">' + escapeHtml(movie.year) + '</span>',
        '    <span class="type-badge">' + escapeHtml(movie.type) + '</span>',
        '  </a>',
        '  <div class="movie-card-body">',
        '    <a class="movie-title" href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a>',
        '    <p>' + escapeHtml(movie.oneLine) + '</p>',
        '    <div class="movie-meta">',
        '      <span>' + escapeHtml(movie.region) + '</span>',
        '      <span>' + escapeHtml(movie.genre) + '</span>',
        '    </div>',
        '  </div>',
        '</article>'
      ].join('');
    }).join('');
  }

  renderSearchResults();
})();
