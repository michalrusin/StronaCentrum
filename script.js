// Plik script.js jest pusty, bo nie są potrzebne żadne dodatkowe skrypty do obecnego wyglądu strony.

// Animacja scrollowania w miejscu dla sekcji technik informatyk
(function() {
  const section = document.querySelector('.profile-scroll-section');
  if (!section) return;
  const textBox = section.querySelector('#profileText');
  const tiles = Array.from(section.querySelectorAll('.skill-tile'));
  const skillsRow = section.querySelector('#skillsRow');

  // Tworzymy wrapper sticky jeśli nie istnieje
  let stickyWrapper = section.parentElement;
  if (!stickyWrapper.classList.contains('sticky-scroll-wrapper')) {
    stickyWrapper = document.createElement('div');
    stickyWrapper.className = 'sticky-scroll-wrapper';
    stickyWrapper.style.position = 'relative';
    stickyWrapper.style.height = '250vh'; // wysokość do scrollowania
    section.parentNode.insertBefore(stickyWrapper, section);
    stickyWrapper.appendChild(section);
  }
  section.style.position = 'sticky';
  section.style.top = '0';
  section.style.height = '100vh';
  section.style.zIndex = '1';
  section.style.background = 'linear-gradient(120deg, #e0f7fa 0%, #eaffea 100%)';

  // Fade-in tekstu
  function showText() {
    textBox.classList.add('visible');
    textBox.classList.remove('opacity-0');
  }
  function hideText() {
    textBox.classList.remove('visible');
    textBox.classList.add('opacity-0');
  }

  // Parallax kafelków
  function animateTiles(progress) {
    const tileCount = tiles.length;
    const tileStep = 1 / (tileCount + 1);
    tiles.forEach((tile, i) => {
      const appear = (i + 1) * tileStep;
      const disappear = appear + tileStep;
      if (progress > appear && progress < disappear) {
        const local = (progress - appear) / tileStep;
        tile.style.opacity = local;
        tile.style.transform = `translateX(${(1-local)*80}px)`;
      } else if (progress >= disappear) {
        tile.style.opacity = 1;
        tile.style.transform = 'translateX(0)';
      } else {
        tile.style.opacity = 0;
        tile.style.transform = 'translateX(80px)';
      }
    });
  }

  function onScroll() {
    const wrapperRect = stickyWrapper.getBoundingClientRect();
    const windowH = window.innerHeight;
    const stickyStart = windowH * 0.1;
    const stickyEnd = stickyWrapper.offsetHeight - windowH * 1.1;
    const scrollY = -wrapperRect.top + stickyStart;
    const maxScroll = stickyEnd - stickyStart;
    const progress = Math.min(1, Math.max(0, scrollY / maxScroll));

    // Fade-in tekstu na początku sticky
    if (progress > 0.05) {
      showText();
    } else {
      hideText();
    }
    // Parallax kafelków
    animateTiles(progress);
  }

  // Reset kafelków na start
  tiles.forEach(tile => {
    tile.style.opacity = 0;
    tile.style.transform = 'translateX(80px)';
  });
  hideText();

  window.addEventListener('scroll', onScroll);
  onScroll();
})();

// Obsługa zatrzymywania caruzeli podczas modala projektów
(function() {
  const carousel = document.getElementById('projectsCarousel');
  if (!carousel) return;
  let carouselInstance = bootstrap.Carousel.getOrCreateInstance(carousel);
  let lastSlide = 0;

  // Zapamiętaj slajd przy kliknięciu w Szczegóły
  document.querySelectorAll('.project-details-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      // Odczytaj aktualny slajd
      const active = carousel.querySelector('.carousel-item.active');
      lastSlide = Array.from(carousel.querySelectorAll('.carousel-item')).indexOf(active);
      carouselInstance.pause();
    });
  });

  // Po zamknięciu dowolnego modala wróć do tego slajdu i wznow caruzelę
  document.querySelectorAll('[id^="projectModal"]').forEach(modalEl => {
    modalEl.addEventListener('hidden.bs.modal', function() {
      carouselInstance.to(lastSlide);
      carouselInstance.cycle();
    });
  });
})();

// Sticky scroll i dynamiczny modal sal lekcyjnych
(function() {
  const rooms = {
    '101B': {
      img: '198.jpg',
      title: 'Sala 101B',
      desc: 'Sala do zajęć teoretycznych wyposażona w sprzęt multimedialny, idealna do prowadzenia wykładów i prezentacji.',
      features: [
        'Projektor multimedialny',
        'System nagłośnienia',
        '30 miejsc dla uczniów'
      ]
    },
    '102B': {
      img: '198.jpg',
      title: 'Sala 102B',
      desc: 'Główna sala komputerowa z 16 stanowiskami, wyposażona w nowoczesny sprzęt do nauki programowania i grafiki komputerowej.',
      features: [
        '16 stanowisk komputerowych',
        'Projektor multimedialny',
        'Tablica interaktywna',
        'Drukarka 3D'
      ]
    },
    '105B': {
      img: '198.jpg',
      title: 'Sala 105B',
      desc: 'Nowoczesne laboratorium komputerowe do nauki programowania i tworzenia aplikacji.',
      features: [
        '12 stanowisk komputerowych',
        'Sprzęt do VR',
        'Stanowisko serwerowe'
      ]
    },
    'Akwarium': {
      img: '198.jpg',
      title: 'Akwarium',
      desc: 'Kameralna sala do pracy indywidualnej i małych grup projektowych, idealna do burzy mózgów i pracy zespołowej.',
      features: [
        '8 miejsc do pracy',
        'Tablica suchościeralna',
        'Dostęp do internetu'
      ]
    }
  };

  const list = document.getElementById('classroom-list');
  const links = list ? Array.from(list.querySelectorAll('.classroom-link')) : [];
  const modal = document.getElementById('classroom-modal');
  const img = document.getElementById('classroom-img');
  const title = document.getElementById('classroom-title');
  const desc = document.getElementById('classroom-desc');
  const features = document.getElementById('classroom-features');

  if (!list || !modal) return;

  function showRoom(roomKey) {
    const room = rooms[roomKey];
    if (!room) return;
    img.src = room.img;
    img.alt = room.title;
    title.textContent = room.title;
    desc.textContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisl quis neque.';
    features.innerHTML = '';
  }

  function setActive(roomKey) {
    links.forEach(link => {
      if (link.dataset.room === roomKey) {
        link.classList.add('active');
        link.style.color = '#111';
        link.style.fontWeight = 'bold';
      } else {
        link.classList.remove('active');
        link.style.color = '#bbb';
        link.style.fontWeight = 'normal';
      }
    });
  }

  // Obsługa kliknięcia
  links.forEach(link => {
    link.addEventListener('click', function() {
      const roomKey = this.dataset.room;
      showRoom(roomKey);
      setActive(roomKey);
    });
  });

  // Sticky scroll: podświetlanie na podstawie scrolla sekcji
  function onScroll() {
    const anchors = Array.from(document.querySelectorAll('.room-anchor'));
    const stickySection = document.querySelector('.sticky-scroll-section');
    if (!stickySection) return;
    const stickyRect = stickySection.getBoundingClientRect();
    // Only activate if sticky section is visible (sticky effect is active)
    if (stickyRect.bottom <= 0 || stickyRect.top >= window.innerHeight) return;

    let activeRoom = anchors[0]?.dataset.room;
    let minDelta = -Infinity;
    const buffer = 40; // px, how far from the top of sticky section to activate

    anchors.forEach(anchor => {
      const rect = anchor.getBoundingClientRect();
      const delta = rect.top - stickyRect.top - buffer;
      if (delta <= 0 && delta > minDelta) {
        minDelta = delta;
        activeRoom = anchor.dataset.room;
      }
    });
    showRoom(activeRoom);
    setActive(activeRoom);
  }

  window.addEventListener('scroll', onScroll);
  // Domyślnie pierwsza sala
  showRoom('101B');
  setActive('101B');
})();
