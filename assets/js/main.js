/**
 * Aws Hameed - Portfolio Core Logic
 * Rich animations, 3D tilt, spotlight, modal previews, live clock & theme toggling
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTypewriter();
  initSpotlightsAndTilt();
  initScrollAnimations();
  initNavSpy();
  initProjectFilters();
  initProjectModal();
  initContactForm();
  initCopyEmail();
  initSoundToggle();
  initLiveClock();
  initMobileNav();
  initResumeModal();
});

/* ==========================================================================
   1. Theme Management (Dark / Light)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const savedTheme = localStorage.getItem('theme') || 'dark';

  if (savedTheme === 'light') {
    document.documentElement.classList.add('light');
    if (themeIcon) themeIcon.textContent = '☀️';
  } else {
    document.documentElement.classList.remove('light');
    if (themeIcon) themeIcon.textContent = '🌙';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('light');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      if (themeIcon) themeIcon.textContent = isLight ? '☀️' : '🌙';
      if (window.soundManager) window.soundManager.click();
    });
  }
}

/* ==========================================================================
   2. Dynamic Typewriter in Hero
   ========================================================================== */
function initTypewriter() {
  const textElement = document.getElementById('typewriter-text');
  if (!textElement) return;

  const phrases = [
    "AI-integrated applications.",
    "scalable Linux VPS deployments.",
    "automated Python workflows.",
    "high-performance C++ systems.",
    "sturdy e-commerce backends."
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      textElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      textElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 70;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2200; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before typing new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   3. 3D Tilt & Spotlight Follower
   ========================================================================== */
function initSpotlightsAndTilt() {
  const cards = document.querySelectorAll('.spotlight-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update spotlight position
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // 3D tilt calculation
      if (card.classList.contains('tilt-card') && window.innerWidth > 768) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      if (card.classList.contains('tilt-card')) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        card.style.transition = 'transform 0.5s ease-out';
      }
    });

    card.addEventListener('mouseenter', () => {
      if (card.classList.contains('tilt-card')) {
        card.style.transition = 'transform 0.1s ease-out';
      }
      if (window.soundManager) window.soundManager.hover();
    });
  });
}

/* ==========================================================================
   4. Scroll Reveal Animations
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   5. Floating Nav Active Indicator Spy
   ========================================================================== */
function initNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 140;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        current = sectionId;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active-nav-link');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active-nav-link');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   6. Project Filters
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active-filter');
        b.classList.add('text-slate-400');
      });
      btn.classList.add('active-filter');
      btn.classList.remove('text-slate-400');

      if (window.soundManager) window.soundManager.click();

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   7. Project Detailed Modal
   ========================================================================== */
const projectData = {
  1: {
    title: "Custom Print E-Commerce Platform",
    tagline: "Scalable Production Deployment with VPS CI/CD Pipeline",
    tags: ["Python", "PostgreSQL", "Nginx", "Gunicorn", "Cloudflare", "VPS", "CI/CD"],
    overview: "A full-scale custom print merchandising e-commerce platform built to withstand real production traffic. Configured from bare Linux VPS to deployment with automated GitHub Actions CI/CD pipelines, SSL termination, and Cloudflare proxy caching.",
    features: [
      "Automated CI/CD deployment pipeline triggering on git push to production VPS.",
      "Gunicorn WSGI cluster managed under systemd with auto-restart daemons.",
      "PostgreSQL relational database with connection pooling and automated daily backups.",
      "Nginx reverse proxy with gzip compression, HTTP/2, and Cloudflare edge caching for sub-100ms response times."
    ],
    liveUrl: "https://awshameed.me/#",
    githubUrl: "https://github.com/L1F25BSCS0511-Aws"
  },
  2: {
    title: "Storyframe AI Studio",
    tagline: "2D Character-Consistent Storyboard Generation Engine",
    tags: ["React", "Tailwind CSS", "Gemini API", "AI Studio", "Canvas API"],
    overview: "A lightweight, high-productivity single-file web application designed for creative directors and story artists. Generates sequential 2D hand-drawn storyboards while preserving character design consistency across dynamic camera angles.",
    features: [
      "Direct integration with Google AI Studio & Gemini Vision/Multimodal API.",
      "Dynamic prompt engineering retaining visual anchor tokens for facial and costume consistency.",
      "Interactive storyboard grid with frame reordering, scene notes, camera framing, and direct PNG/PDF export.",
      "Zero-latency reactive state with instant live render."
    ],
    liveUrl: "https://awshameed.me/#",
    githubUrl: "https://github.com/L1F25BSCS0511-Aws"
  },
  3: {
    title: "Python Automation Suites (TubTub, MemAlloc & FleetFlow)",
    tagline: "High-Throughput Video Synthesis & Telemetry Automation",
    tags: ["Python", "MoviePy", "FFmpeg", "edge-tts", "Pandas", "openpyxl"],
    overview: "A collection of industrial-strength Python automation suites engineered for multimedia processing, automated video rendering, neural voice synthesis, and Git telemetry tracking.",
    features: [
      "TubTub-Automator: Fully automated video generation pipeline orchestrating FFmpeg filters, MoviePy timeline assembly, and dynamic caption burning.",
      "MemAlloc-Core & FleetFlow: Automated data parsing, structured spreadsheet generation, and scheduled automated commit history telemetry.",
      "Neural voice synthesis using Microsoft edge-tts with precise word-level subtitle alignment.",
      "Handles heavy file I/O operations asynchronously with error recovery."
    ],
    liveUrl: "https://awshameed.me/#",
    githubUrl: "https://github.com/L1F25BSCS0511-Aws"
  },
  4: {
    title: "High-Performance OOP C++ System",
    tagline: "Enterprise-Pattern Architecture in Modern C++",
    tags: ["C++", "OOP", "Polymorphism", "Virtual Tables", "Dynamic Memory", "fstream"],
    overview: "A comprehensive console software system built strictly according to modern object-oriented principles, emphasizing deep memory management, abstraction, and data integrity.",
    features: [
      "Implements runtime polymorphism, abstract base classes, and custom virtual method dispatch tables.",
      "Operator overloading for clean syntax and seamless stream serialization.",
      "Manual dynamic memory allocation with strict RAII rules preventing memory leaks.",
      "Binary file stream (fstream) persistence with structured record indexing and fast retrieval."
    ],
    liveUrl: "https://awshameed.me/#",
    githubUrl: "https://github.com/L1F25BSCS0511-Aws"
  },
  5: {
    title: "Interactive Frontend & E-Commerce Tools",
    tagline: "Conversion-Focused UI Components & Shopify Liquid Architecture",
    tags: ["React", "Tailwind CSS", "Shopify Liquid", "Micro-Interactions"],
    overview: "A suite of modern e-commerce user experience tools engineered for fashion brands and digital storefronts to elevate conversion rates and visual engagement.",
    features: [
      "Real-time color-variation previewer with zero page reload and fluid image crossfades.",
      "Dynamic luxury fashion catalog lookbook layouts with responsive masonry grids.",
      "High-performance Shopify Liquid marquee announcement tickers with hardware-accelerated CSS.",
      "Mobile-first touch gestures and seamless shopping cart drawer states."
    ],
    liveUrl: "https://awshameed.me/#",
    githubUrl: "https://github.com/L1F25BSCS0511-Aws"
  }
};

function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('close-project-modal');
  const exploreBtns = document.querySelectorAll('.explore-project-btn');

  if (!modal) return;

  exploreBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const data = projectData[id];
      if (!data) return;

      document.getElementById('modal-title').textContent = data.title;
      document.getElementById('modal-tagline').textContent = data.tagline;
      document.getElementById('modal-overview').textContent = data.overview;

      // Render tags
      const tagsContainer = document.getElementById('modal-tags');
      tagsContainer.innerHTML = data.tags.map(t => 
        `<span class="px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">${t}</span>`
      ).join('');

      // Render features
      const featuresContainer = document.getElementById('modal-features');
      featuresContainer.innerHTML = data.features.map(f =>
        `<li class="flex items-start gap-2.5 text-slate-300 text-sm">
          <span class="text-emerald-400 mt-1">✓</span>
          <span>${f}</span>
        </li>`
      ).join('');

      // Links
      document.getElementById('modal-live-link').href = data.liveUrl;
      document.getElementById('modal-github-link').href = data.githubUrl;

      modal.classList.remove('hidden');
      modal.classList.add('flex');
      if (window.soundManager) window.soundManager.open();
    });
  });

  function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/* ==========================================================================
   8. Copy Email with Toast
   ========================================================================== */
function initCopyEmail() {
  const copyBtns = document.querySelectorAll('.copy-email-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const email = "awshameed.dev@gmail.com";
      navigator.clipboard.writeText(email).then(() => {
        showToast("Email copied to clipboard! 📋✨", "success");
        if (window.soundManager) window.soundManager.success();
      }).catch(() => {
        showToast("awshameed.dev@gmail.com", "info");
      });
    });
  });
}

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 3200);
}

/* ==========================================================================
   9. Contact Form
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim() || 'Portfolio Inquiry';
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      Opening Email Client...
    `;
    submitBtn.disabled = true;

    if (window.soundManager) window.soundManager.click();

    setTimeout(() => {
      // Create mailto link
      const mailtoUrl = `mailto:awshameed.dev@gmail.com?subject=${encodeURIComponent(subject + ' - from ' + name)}&body=${encodeURIComponent("Sender Name: " + name + "\nSender Email: " + email + "\n\nMessage:\n" + message)}`;
      window.location.href = mailtoUrl;

      submitBtn.innerHTML = `<span>✓ Message Prepared!</span>`;
      showToast("Email client triggered! Thank you for reaching out.", "success");
      if (window.soundManager) window.soundManager.success();

      // Trigger celebratory confetti if library available
      if (typeof confetti === 'function') {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      }

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        form.reset();
      }, 4000);
    }, 600);
  });
}

/* ==========================================================================
   10. Sound Toggle Button
   ========================================================================== */
function initSoundToggle() {
  const soundBtn = document.getElementById('sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  if (!soundBtn) return;

  function updateIcon(enabled) {
    if (soundIcon) {
      soundIcon.textContent = enabled ? '🔊' : '🔇';
    }
  }

  updateIcon(window.soundManager.enabled);

  soundBtn.addEventListener('click', () => {
    const isEnabled = window.soundManager.toggle();
    updateIcon(isEnabled);
    showToast(isEnabled ? "Audio effects enabled 🔊" : "Audio muted 🔇", "info");
  });
}

/* ==========================================================================
   11. Live Clock (Lahore, Pakistan PKT UTC+5)
   ========================================================================== */
function initLiveClock() {
  const clockEl = document.getElementById('lahore-time');
  if (!clockEl) return;

  function update() {
    try {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Karachi',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const formatter = new Intl.DateTimeFormat([], options);
      clockEl.textContent = `${formatter.format(now)} PKT (UTC+5)`;
    } catch (e) {
      clockEl.textContent = "Lahore, Pakistan";
    }
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   12. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-menu');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    drawer.classList.toggle('hidden');
    drawer.classList.toggle('flex');
    if (window.soundManager) window.soundManager.click();
  });

  links.forEach(l => {
    l.addEventListener('click', () => {
      drawer.classList.add('hidden');
      drawer.classList.remove('flex');
    });
  });
}

/* ==========================================================================
   13. Resume Modal & Quick View
   ========================================================================== */
function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const openBtns = document.querySelectorAll('.open-resume-btn');
  const closeBtn = document.getElementById('close-resume-modal');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      if (window.soundManager) window.soundManager.open();
    });
  });

  function closeResume() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeResume);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeResume();
  });
}
