(function () {
    var form = document.querySelector('.search-panel form');
    var input = document.querySelector('#movie-search-input');
    var result = document.querySelector('#search-results');
    var status = document.querySelector('#search-status');
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
    var activeFilter = 'all';

    function params() {
        return new URLSearchParams(window.location.search);
    }

    function escapeText(value) {
        return String(value || '').replace(/[&<>"]/g, function (char) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;'
            }[char];
        });
    }

    function itemTemplate(movie) {
        return [
            '<a class="movie-card" href="' + escapeText(movie.url) + '">',
            '    <div class="card-cover">',
            '        <img src="' + escapeText(movie.cover) + '" alt="' + escapeText(movie.title) + '" loading="lazy">',
            '        <span class="card-badge">' + escapeText(movie.category) + '</span>',
            '    </div>',
            '    <div class="card-content">',
            '        <h3>' + escapeText(movie.title) + '</h3>',
            '        <p>' + escapeText(movie.summary) + '</p>',
            '        <div class="card-meta">',
            '            <span>' + escapeText(movie.year) + '</span>',
            '            <span>' + escapeText(movie.region) + '</span>',
            '        </div>',
            '        <div class="tag-row"><span>' + escapeText(movie.genre.split(/[、,，/]/)[0]) + '</span></div>',
            '    </div>',
            '</a>'
        ].join('');
    }

    function render() {
        if (!result || !status || !window.SEARCH_MOVIES) {
            return;
        }
        var keyword = input ? input.value.trim().toLowerCase() : '';
        var list = window.SEARCH_MOVIES.filter(function (movie) {
            var text = [movie.title, movie.year, movie.region, movie.genre, movie.category, movie.summary].join(' ').toLowerCase();
            var matchedKeyword = keyword ? text.indexOf(keyword) !== -1 : true;
            var matchedFilter = activeFilter === 'all' ? true : movie.category === activeFilter;
            return matchedKeyword && matchedFilter;
        }).slice(0, 120);

        status.textContent = keyword ? '为你找到相关影片' : '输入片名、地区、年份或类型进行搜索';
        result.innerHTML = list.map(itemTemplate).join('');
    }

    if (input) {
        var query = params().get('q') || '';
        input.value = query;
        input.addEventListener('input', render);
    }

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            render();
        });
    }

    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            activeFilter = button.getAttribute('data-filter');
            buttons.forEach(function (item) {
                item.classList.toggle('is-active', item === button);
            });
            render();
        });
    });

    render();
})();
