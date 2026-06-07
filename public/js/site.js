(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var mouseFxEnabled = finePointer && !reducedMotion;

  var loader = document.getElementById('pageLoader');
  function hideLoader() { if (loader) loader.classList.add('hidden'); }
  window.addEventListener('load', hideLoader);
  setTimeout(hideLoader, 900);

  var nav = document.querySelector('.nav-shell');
  window.addEventListener('scroll', function () {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  /* Scroll progress bar */
  var progressBar = document.getElementById('scrollProgress');
  function updateProgress() {
    if (!progressBar) return;
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  var path = window.location.pathname.replace(/\/$/, '') || '/';
  var map = { '/': 'home', '/resume': 'resume', '/project': 'projects', '/certificate': 'certs' };
  var current = map[path] || '';

  document.querySelectorAll('[data-nav]').forEach(function (el) {
    if (el.dataset.nav === current) el.classList.add('active');
  });

  /* Scroll spy for homepage sections */
  if (path === '/') {
    var sectionLinks = document.querySelectorAll('[data-section]');
    var sections = [];
    sectionLinks.forEach(function (link) {
      var id = link.dataset.section;
      var section = document.getElementById(id);
      if (section) sections.push({ id: id, el: section, link: link });
    });

    if (sections.length && 'IntersectionObserver' in window) {
      var spyObs = new IntersectionObserver(function (entries) {
        var visible = entries.filter(function (e) { return e.isIntersecting; });
        if (!visible.length) return;
        visible.sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
        var top = visible[0].target;
        sectionLinks.forEach(function (l) { l.classList.remove('active'); });
        var match = sections.find(function (s) { return s.el === top; });
        if (match) match.link.classList.add('active');
      }, { threshold: [0.2, 0.4, 0.6], rootMargin: '-15% 0px -50% 0px' });

      sections.forEach(function (s) { spyObs.observe(s.el); });
    }
  }

  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () { menu.classList.toggle('open'); });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { menu.classList.remove('open'); });
    });
  }

  document.querySelectorAll('a[target="_blank"]').forEach(function (a) {
    if (!a.getAttribute('rel')) a.setAttribute('rel', 'noopener noreferrer');
  });

  /* About photo fallback when image file is missing */
  document.querySelectorAll('.about-photo img').forEach(function (img) {
    function showFallback() {
      img.classList.add('hidden');
      var fb = img.parentElement && img.parentElement.querySelector('.about-photo-fallback');
      if (fb) fb.classList.add('visible');
    }
    img.addEventListener('error', showFallback);
    if (img.complete && img.naturalWidth === 0) showFallback();
  });

  /* Scroll fade-in with stagger */
  var fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    var fadeObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i * 0.06, 0.36) + 's';
      fadeObs.observe(el);
    });
  } else {
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* Card spotlight follow cursor */
  document.querySelectorAll('.glow-card, .research-card, .proj-archive-card, .cert-card, .skill-category').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      card.style.setProperty('--spot-x', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--spot-y', (e.clientY - rect.top) + 'px');
    });
  });

  /* ── Mouse follow animations (desktop) ── */
  if (mouseFxEnabled) {
    document.body.classList.add('mouse-fx');

    var cursorGlow = document.getElementById('cursorGlow');
    var cursorDot = document.getElementById('cursorDot');
    var cursorRing = document.getElementById('cursorRing');
    var bgGlow = document.getElementById('bgGlow');
    var bgGrid = document.getElementById('bgGrid');

    var mouseX = window.innerWidth / 2;
    var mouseY = window.innerHeight / 2;
    var ringX = mouseX;
    var ringY = mouseY;
    var glowX = mouseX;
    var glowY = mouseY;
    var rafId = null;

    var interactiveSelector = 'a, button, .btn, .glow-card, .research-card, .proj-archive-card, .cert-card, .skill-category, .skill-item, .award-card, .tech-chip, .nav-logo, .social-icon, .terminal';

    function lerp(start, end, amt) {
      return start + (end - start) * amt;
    }

    function setPos(el, x, y) {
      if (el) el.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
    }

    function animateCursor() {
      ringX = lerp(ringX, mouseX, 0.14);
      ringY = lerp(ringY, mouseY, 0.14);
      glowX = lerp(glowX, mouseX, 0.06);
      glowY = lerp(glowY, mouseY, 0.06);

      setPos(cursorDot, mouseX, mouseY);
      setPos(cursorRing, ringX, ringY);
      setPos(cursorGlow, glowX, glowY);

      if (bgGlow) {
        var bx = (mouseX / window.innerWidth - 0.5) * 80;
        var by = (mouseY / window.innerHeight - 0.5) * 50;
        bgGlow.style.transform = 'translate(' + bx + 'px,' + by + 'px)';
      }

      if (bgGrid) {
        var gx = (mouseX / window.innerWidth - 0.5) * 12;
        var gy = (mouseY / window.innerHeight - 0.5) * 12;
        bgGrid.style.backgroundPosition = gx + 'px ' + gy + 'px';
      }

      rafId = requestAnimationFrame(animateCursor);
    }

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorRing) {
        cursorRing.classList.toggle('hovering', !!e.target.closest(interactiveSelector));
      }
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      if (cursorGlow) cursorGlow.style.opacity = '0';
      if (cursorRing) cursorRing.classList.remove('hovering');
    });

    document.addEventListener('mouseenter', function () {
      if (cursorGlow) cursorGlow.style.opacity = '1';
    });

    animateCursor();

    /* Subtle 3D tilt on cards */
    document.querySelectorAll('.glow-card, .research-card, .proj-archive-card, .cert-card, .terminal, .skill-category, .award-card').forEach(function (card) {
      card.classList.add('tilt-card');

      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(900px) rotateX(' + (-y * 5).toFixed(2) + 'deg) rotateY(' + (x * 5).toFixed(2) + 'deg) translateY(-4px)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });

    window.addEventListener('scroll', function () {
      document.querySelectorAll('.tilt-card').forEach(function (card) {
        card.style.transform = '';
      });
    }, { passive: true });

    /* Magnetic pull on buttons */
    document.querySelectorAll('.btn, .nav-resume, .nav-logo').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = 'translate(' + (x * 0.18).toFixed(1) + 'px,' + (y * 0.18).toFixed(1) + 'px)';
      });

      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });
  }

  /* Terminal typing effect */
  var typeTarget = document.getElementById('typeTarget');
  if (typeTarget && !reducedMotion) {
    var commands = [
      'npm run ship',
      'git push production',
      'docker compose up -d',
      'echo "Open to remote"'
    ];
    var cmdIndex = 0;
    var charIndex = 0;
    var deleting = false;

    function typeLoop() {
      var currentCmd = commands[cmdIndex];
      if (!deleting) {
        typeTarget.textContent = currentCmd.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentCmd.length) {
          setTimeout(function () { deleting = true; typeLoop(); }, 2200);
          return;
        }
        setTimeout(typeLoop, 75);
      } else {
        typeTarget.textContent = currentCmd.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          cmdIndex = (cmdIndex + 1) % commands.length;
          setTimeout(typeLoop, 350);
          return;
        }
        setTimeout(typeLoop, 35);
      }
    }
    setTimeout(typeLoop, 900);
  } else if (typeTarget) {
    typeTarget.textContent = 'npm run ship';
  }

  /* Respect reduced motion */
  if (reducedMotion) {
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
      el.style.transitionDelay = '0s';
    });
  }
})();
