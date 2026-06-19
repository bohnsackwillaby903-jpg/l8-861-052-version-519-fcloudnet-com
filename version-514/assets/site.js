const menuButton = document.querySelector('[data-menu-toggle]');
const mainNav = document.querySelector('[data-main-nav]');

if (menuButton && mainNav) {
  menuButton.addEventListener('click', () => {
    mainNav.classList.toggle('is-open');
  });
}

const hero = document.querySelector('[data-hero]');

if (hero) {
  const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
  const previous = hero.querySelector('[data-hero-prev]');
  const next = hero.querySelector('[data-hero-next]');
  let activeIndex = 0;
  let timer = null;

  const showSlide = (index) => {
    if (!slides.length) {
      return;
    }

    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === activeIndex);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === activeIndex);
    });
  };

  const startTimer = () => {
    clearInterval(timer);
    timer = setInterval(() => showSlide(activeIndex + 1), 5200);
  };

  previous?.addEventListener('click', () => {
    showSlide(activeIndex - 1);
    startTimer();
  });

  next?.addEventListener('click', () => {
    showSlide(activeIndex + 1);
    startTimer();
  });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      showSlide(Number(dot.dataset.heroDot));
      startTimer();
    });
  });

  showSlide(0);
  startTimer();
}

const localSearch = document.querySelector('[data-local-search]');
const cards = Array.from(document.querySelectorAll('[data-search-card]'));
const filterButtons = Array.from(document.querySelectorAll('[data-filter-value]'));
const resultCount = document.querySelector('[data-result-count]');

const params = new URLSearchParams(window.location.search);
const initialQuery = params.get('q') || '';
let activeFilter = '全部';

const normalize = (value) => (value || '').toString().trim().toLowerCase();

const applySearch = () => {
  const keyword = normalize(localSearch?.value || '');
  let visible = 0;

  cards.forEach((card) => {
    const haystack = normalize([
      card.dataset.title,
      card.dataset.year,
      card.dataset.region,
      card.dataset.genre,
      card.textContent
    ].join(' '));
    const genre = normalize(card.dataset.genre);
    const keywordMatch = !keyword || haystack.includes(keyword);
    const filterMatch = activeFilter === '全部' || haystack.includes(normalize(activeFilter)) || genre.includes(normalize(activeFilter));

    card.classList.toggle('is-hidden-by-search', !keywordMatch);
    card.classList.toggle('is-hidden-by-filter', !filterMatch);

    if (keywordMatch && filterMatch) {
      visible += 1;
    }
  });

  if (resultCount) {
    resultCount.textContent = `正在显示 ${visible} 部影片`;
  }
};

if (localSearch) {
  localSearch.value = initialQuery;
  localSearch.addEventListener('input', applySearch);
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filterValue || '全部';
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    applySearch();
  });
});

if (filterButtons.length) {
  filterButtons[0].classList.add('active');
}

applySearch();

const backTop = document.querySelector('[data-back-top]');

if (backTop) {
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
