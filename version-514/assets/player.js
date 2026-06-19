import { H as Hls } from './hls-core.js';

const initializePlayer = (shell) => {
  const video = shell.querySelector('video');
  const button = shell.querySelector('.play-overlay');
  const source = shell.getAttribute('data-video-src');
  let attached = false;
  let hls = null;

  const attachSource = () => {
    if (!video || !source || attached) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }

    attached = true;
  };

  const startPlayback = async () => {
    attachSource();
    shell.classList.add('is-playing');

    if (button) {
      button.hidden = true;
    }

    try {
      await video.play();
    } catch (error) {
      shell.classList.remove('is-playing');
      if (button) {
        button.hidden = false;
      }
    }
  };

  button?.addEventListener('click', startPlayback);

  video?.addEventListener('click', () => {
    if (video.paused) {
      startPlayback();
    }
  });

  video?.addEventListener('play', () => {
    shell.classList.add('is-playing');
    if (button) {
      button.hidden = true;
    }
  });

  video?.addEventListener('emptied', () => {
    if (hls) {
      hls.destroy();
      hls = null;
      attached = false;
    }
  });
};

Array.from(document.querySelectorAll('[data-video-src]')).forEach(initializePlayer);
