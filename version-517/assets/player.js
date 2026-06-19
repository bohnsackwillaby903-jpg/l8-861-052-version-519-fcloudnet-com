import { H as Hls } from './video-player-dru42stk.js';

(function () {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

    players.forEach(function (frame) {
        var video = frame.querySelector('video[data-stream]');
        var button = frame.querySelector('.play-overlay');

        if (!video || !button) {
            return;
        }

        var source = video.getAttribute('data-stream');
        var initialized = false;
        var hlsInstance = null;

        function bindSource() {
            if (initialized || !source) {
                return;
            }

            initialized = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                return;
            }

            if (Hls && Hls.isSupported()) {
                hlsInstance = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
            }
        }

        function startPlayback() {
            bindSource();
            frame.classList.add('is-playing');

            var playPromise = video.play();

            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {
                    frame.classList.remove('is-playing');
                });
            }
        }

        button.addEventListener('click', startPlayback);

        video.addEventListener('play', function () {
            frame.classList.add('is-playing');
        });

        video.addEventListener('pause', function () {
            if (!video.ended) {
                frame.classList.remove('is-playing');
            }
        });

        video.addEventListener('ended', function () {
            frame.classList.remove('is-playing');
        });

        window.addEventListener('pagehide', function () {
            if (hlsInstance && typeof hlsInstance.destroy === 'function') {
                hlsInstance.destroy();
            }
        });
    });
})();
