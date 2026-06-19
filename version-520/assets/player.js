(function () {
    function bindPlayer(box) {
        var video = box.querySelector('video');
        var button = box.querySelector('.play-overlay');
        var url = box.getAttribute('data-video');
        var hls = null;
        var ready = false;

        function setup() {
            if (ready || !video || !url) {
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hls.loadSource(url);
                hls.attachMedia(video);
            } else {
                video.src = url;
            }
            ready = true;
        }

        function begin() {
            setup();
            if (!video) {
                return;
            }
            video.controls = true;
            if (button) {
                button.classList.add('is-hidden');
            }
            var action = video.play();
            if (action && typeof action.catch === 'function') {
                action.catch(function () {
                    if (button) {
                        button.classList.remove('is-hidden');
                    }
                });
            }
        }

        if (button) {
            button.addEventListener('click', begin);
        }
        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    begin();
                }
            });
            video.addEventListener('play', function () {
                if (button) {
                    button.classList.add('is-hidden');
                }
            });
            video.addEventListener('pause', function () {
                if (video.currentTime === 0 && button) {
                    button.classList.remove('is-hidden');
                }
            });
        }
        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    document.querySelectorAll('.player-shell').forEach(bindPlayer);
})();
