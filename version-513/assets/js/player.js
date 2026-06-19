(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var players = Array.prototype.slice.call(document.querySelectorAll(".movie-player"));

        players.forEach(function (player) {
            var video = player.querySelector("video");
            var button = player.querySelector(".player-overlay");
            var stream = player.getAttribute("data-stream");
            var hlsInstance = null;
            var isAttached = false;

            function attachStream() {
                if (!video || !stream || isAttached) {
                    return;
                }

                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = stream;
                    isAttached = true;
                    return;
                }

                if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });

                    hlsInstance.loadSource(stream);
                    hlsInstance.attachMedia(video);
                    isAttached = true;
                    return;
                }

                video.src = stream;
                isAttached = true;
            }

            function startPlayback() {
                attachStream();
                player.classList.add("is-active");

                if (video) {
                    var result = video.play();

                    if (result && typeof result.catch === "function") {
                        result.catch(function () {
                            player.classList.remove("is-active");
                        });
                    }
                }
            }

            if (button) {
                button.addEventListener("click", startPlayback);
            }

            if (video) {
                video.addEventListener("play", function () {
                    player.classList.add("is-active");
                });

                video.addEventListener("click", function () {
                    if (video.paused) {
                        startPlayback();
                    }
                });
            }

            window.addEventListener("beforeunload", function () {
                if (hlsInstance) {
                    hlsInstance.destroy();
                }
            });
        });
    });
})();
