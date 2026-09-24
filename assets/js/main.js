'use strict';

window.rubi = (() => {
  'use strict';

  // ========== Toast ==========
  const Toast = (() => {
    const showToast = (msg, type = 'success') => {
      const existing = document.querySelector('.toast');
      if (existing) existing.remove();

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.setAttribute('role', 'alert');
      toast.textContent = msg;
      document.body.appendChild(toast);

      requestAnimationFrame(() => {
        toast.classList.add('show');
      });

      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          if (toast.parentNode) toast.remove();
        }, 300);
      }, 4000);
    };

    return { showToast };
  })();

  // ========== Navbar ==========
  const Navbar = (() => {
    const getBackdrop = () =>
      document.querySelector('#drawerOverlay, #mobileDrawerBackdrop');

    const openDrawer = (drawer) => {
      drawer.classList.add('open');
      const bd = getBackdrop();
      if (bd) {
        bd.classList.add('show');
        if (bd.id === 'drawerOverlay') bd.classList.add('active');
      }
    };

    const closeDrawer = (drawer) => {
      drawer.classList.remove('open');
      const bd = getBackdrop();
      if (bd) {
        bd.classList.remove('show');
        if (bd.id === 'drawerOverlay') bd.classList.remove('active');
      }
    };

    const init = () => {
      const menuToggle = document.querySelector('#menuToggle');
      const mobileDrawer = document.querySelector('#mobileDrawer');

      if (menuToggle && mobileDrawer) {
        menuToggle.addEventListener('click', (e) => {
          e.stopPropagation();
          if (mobileDrawer.classList.contains('open')) {
            closeDrawer(mobileDrawer);
          } else {
            openDrawer(mobileDrawer);
          }
        });

        const closeBtn = mobileDrawer.querySelector('#drawerClose, .drawer-close, [data-drawer-close]');
        if (closeBtn) {
          closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeDrawer(mobileDrawer);
          });
        }

        const backdrop = getBackdrop();
        if (backdrop) {
          backdrop.addEventListener('click', (e) => {
            e.stopPropagation();
            closeDrawer(mobileDrawer);
          });
        }

        document.addEventListener('click', (e) => {
          if (
            mobileDrawer.classList.contains('open') &&
            !mobileDrawer.contains(e.target) &&
            !menuToggle.contains(e.target)
          ) {
            closeDrawer(mobileDrawer);
          }
        });
      }

      const dropdownItems = document.querySelectorAll(
        '.nav-dropdown > .dropdown-toggle, .nav-dropdown > a'
      );
      dropdownItems.forEach((link) => {
        const submenu = link.nextElementSibling;
        if (!submenu) return;
        if (!submenu.classList.contains('dropdown-menu') &&
            !submenu.classList.contains('submenu')) return;

        if (window.matchMedia('(min-width: 992px)').matches) {
          link.addEventListener('mouseenter', () =>
            submenu.classList.add('is-open')
          );
          link.parentElement.addEventListener('mouseleave', () =>
            submenu.classList.remove('is-open')
          );
          submenu.addEventListener('mouseenter', () =>
            submenu.classList.add('is-open')
          );
        } else {
          link.addEventListener('click', (e) => {
            if (
              submenu.classList.contains('is-open') ||
              submenu.classList.contains('open')
            ) {
              submenu.classList.remove('is-open', 'open');
            } else {
              submenu.classList.add('is-open', 'open');
            }
          });
        }
      });
    };

    return { init };
  })();

  // ========== HeroSlider ==========
  const HeroSlider = (() => {
    const init = () => {
      const carousel = document.querySelector('.hero-carousel');
      if (!carousel) return;

      const slides = carousel.querySelectorAll('.slide');
      const prevBtn = document.querySelector('.prev-btn');
      const nextBtn = document.querySelector('.next-btn');
      const dotsContainer = document.querySelector('.carousel-dots');
      const dots = dotsContainer
        ? dotsContainer.querySelectorAll('.dot')
        : [];

      if (slides.length === 0) return;

      let currentIndex = 0;
      let autoTimer = null;
      const INTERVAL = 5000;

      const goToSlide = (index) => {
        currentIndex = (index + slides.length) % slides.length;
        slides.forEach((s, i) => {
          if (i === currentIndex) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
        dots.forEach((d, i) => {
          if (i === currentIndex) {
            d.classList.add('active');
          } else {
            d.classList.remove('active');
          }
        });
        if (dots[currentIndex]) dots[currentIndex].setAttribute('aria-current', 'true');
      };

      const nextSlide = () => goToSlide(currentIndex + 1);
      const prevSlide = () => goToSlide(currentIndex - 1);

      const startAuto = () => {
        stopAuto();
        autoTimer = setInterval(nextSlide, INTERVAL);
      };

      const stopAuto = () => {
        if (autoTimer) {
          clearInterval(autoTimer);
          autoTimer = null;
        }
      };

      const manualAdvance = (fn) => {
        fn();
        stopAuto();
        startAuto();
      };

      if (nextBtn) {
        nextBtn.setAttribute('aria-label', 'Next slide');
        nextBtn.addEventListener('click', () => manualAdvance(nextSlide));
      }
      if (prevBtn) {
        prevBtn.setAttribute('aria-label', 'Previous slide');
        prevBtn.addEventListener('click', () => manualAdvance(prevSlide));
      }

      dots.forEach((dot, i) => {
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => manualAdvance(() => goToSlide(i)));
      });

      carousel.addEventListener('mouseenter', stopAuto);
      carousel.addEventListener('mouseleave', startAuto);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          stopAuto();
        } else {
          startAuto();
        }
      });

      let touchStartX = 0;
      let touchEndX = 0;
      let touchStartY = 0;
      let touchEndY = 0;
      const minSwipe = 40;
      carousel.addEventListener(
        'touchstart',
        (e) => {
          const t = e.changedTouches[0];
          touchStartX = t.screenX;
          touchStartY = t.screenY;
          stopAuto();
        },
        { passive: true }
      );
      carousel.addEventListener(
        'touchmove',
        (e) => {
          const t = e.changedTouches[0];
          touchEndX = t.screenX;
          touchEndY = t.screenY;
        },
        { passive: true }
      );
      carousel.addEventListener(
        'touchend',
        () => {
          const dx = touchEndX - touchStartX;
          const dy = touchEndY - touchStartY;
          if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) >= minSwipe) {
            if (dx < 0) {
              manualAdvance(nextSlide);
            } else {
              manualAdvance(prevSlide);
            }
          } else {
            startAuto();
          }
          touchStartX = 0;
          touchEndX = 0;
          touchStartY = 0;
          touchEndY = 0;
        },
        { passive: true }
      );

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        goToSlide(0);
      } else {
        goToSlide(0);
        startAuto();
      }
    };

    return { init };
  })();

  // ========== Counters ==========
  const Counters = (() => {
    const formatNumber = (num) => {
      if (num >= 1e6) {
        return Math.floor(num / 1e6) + 'M+';
      }
      if (num >= 1e3) {
        return Math.floor(num / 1e3) + 'K+';
      }
      return String(Math.floor(num));
    };

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const animateCounter = (el, target) => {
      const duration = 2000;
      const start = performance.now();

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOut(progress);
        const current = target * eased;
        el.textContent = formatNumber(current);

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = formatNumber(target);
        }
      };

      requestAnimationFrame(tick);
    };

    const init = () => {
      const counters = document.querySelectorAll('.counter-num');
      if (counters.length === 0) return;

      if (!('IntersectionObserver' in window)) {
        counters.forEach((el) => {
          const target = parseFloat(el.dataset.target) || 0;
          animateCounter(el, target);
        });
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target;
              const target = parseFloat(el.dataset.target) || 0;
              animateCounter(el, target);
              observer.unobserve(el);
            }
          });
        },
        { threshold: 0.5 }
      );

      counters.forEach((el) => observer.observe(el));
    };

    return { init };
  })();

  // ========== Tabs ==========
  const Tabs = (() => {
    const init = () => {
      const tabsContainers = document.querySelectorAll('.tabs-section');
      tabsContainers.forEach((container) => {
        const buttons = container.querySelectorAll('.tab-btn');
        const panels = container.querySelectorAll('.tab-panel');

        buttons.forEach((btn) => {
          btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            if (!tabId) return;

            buttons.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            panels.forEach((p) => {
              if (p.id === tabId) {
                p.classList.add('active');
              } else {
                p.classList.remove('active');
              }
            });
          });
        });
      });
    };

    return { init };
  })();

  // ========== Accordion ==========
  const Accordion = (() => {
    const init = () => {
      const faqSections = document.querySelectorAll('.faq, .accordion');
      faqSections.forEach((section) => {
        const detailsList = section.querySelectorAll('details');
        detailsList.forEach((details) => {
          const summary = details.querySelector('summary');
          if (!summary) return;

          summary.addEventListener('click', (e) => {
            if (!details.hasAttribute('open')) {
              detailsList.forEach((d) => {
                if (d !== details && d.hasAttribute('open')) {
                  d.removeAttribute('open');
                }
              });
            }
          });
        });
      });
    };

    return { init };
  })();

  // ========== PartnersCarousel ==========
  const PartnersCarousel = (() => {
    const init = () => {
      const scrollers = document.querySelectorAll('.partners-scroll');
      scrollers.forEach((scroller) => {
        const track = scroller.querySelector('.partners-track');
        if (!track) return;

        const shouldLoop = scroller.dataset.loop === 'true';
        const items = Array.from(track.children);

        if (shouldLoop && items.length > 0) {
          const firstHalf = items.slice(0, Math.ceil(items.length / 2));
          const hasDuplicates = firstHalf.some((el, i) => {
            const j = i + firstHalf.length;
            if (!items[j]) return false;
            return el.innerHTML === items[j].innerHTML;
          });
          if (!hasDuplicates) {
            firstHalf.forEach((child) => {
              const clone = child.cloneNode(true);
              clone.setAttribute('aria-hidden', 'true');
              track.appendChild(clone);
            });
          }
        }

        track.addEventListener('mouseenter', () => {
          track.style.animationPlayState = 'paused';
        });
        track.addEventListener('mouseleave', () => {
          track.style.animationPlayState = 'running';
        });
      });
    };

    return { init };
  })();

  // ========== Forms ==========
  const Forms = (() => {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PHONE_REGEX = /^\d{10,}$/;

    const showFieldError = (field, msg) => {
      field.classList.add('is-invalid');
      let errEl = field.parentElement?.querySelector('.field-error');
      if (!errEl) {
        errEl = document.createElement('span');
        errEl.className = 'field-error';
        field.parentElement?.appendChild(errEl);
      }
      errEl.textContent = msg;
    };

    const clearFieldError = (field) => {
      field.classList.remove('is-invalid');
      const errEl = field.parentElement?.querySelector('.field-error');
      if (errEl) errEl.remove();
    };

    const validateField = (field) => {
      const type = field.type;
      const value = field.value.trim();
      const name = field.name || 'This field';

      if (field.hasAttribute('required') && !value) {
        showFieldError(field, `${name} is required.`);
        return false;
      }

      if (type === 'email' && value && !EMAIL_REGEX.test(value)) {
        showFieldError(field, 'Please enter a valid email address.');
        return false;
      }

      if (
        (type === 'tel' || field.dataset.phone === 'true') &&
        value &&
        !PHONE_REGEX.test(value.replace(/\D/g, ''))
      ) {
        showFieldError(field, 'Phone number must be at least 10 digits.');
        return false;
      }

      clearFieldError(field);
      return true;
    };

    const getCsrfToken = () => {
      const meta = document.querySelector('meta[name="csrf-token"]');
      return meta ? meta.getAttribute('content') : null;
    };

    const init = () => {
      const form = document.querySelector('#contact-form');
      if (!form) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      const fields = form.querySelectorAll(
        'input, textarea, select'
      );

      fields.forEach((field) => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
          if (field.classList.contains('is-invalid')) {
            validateField(field);
          }
        });
      });

      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        let isFormValid = true;
        fields.forEach((f) => {
          if (!validateField(f)) isFormValid = false;
        });

        if (!isFormValid) {
          Toast.showToast('Please fix the errors in the form.', 'error');
          return;
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const csrf = getCsrfToken();
        if (csrf) data._csrf = csrf;

        if (submitBtn) submitBtn.disabled = true;

        try {
          const res = await fetch('/backend/api/contact.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(csrf ? { 'X-CSRF-Token': csrf } : {}),
            },
            body: JSON.stringify(data),
          });

          if (res.ok) {
            Toast.showToast(
              'Thank you! Your message has been sent.',
              'success'
            );
            form.reset();
            fields.forEach(clearFieldError);
          } else {
            Toast.showToast(
              'Something went wrong. Please try again later.',
              'error'
            );
          }
        } catch (err) {
          Toast.showToast(
            'Network error. Please check your connection and try again.',
            'error'
          );
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    };

    return { init };
  })();

  // ========== SmoothScroll ==========
  const SmoothScroll = (() => {
    const init = () => {
      const links = document.querySelectorAll('a[href^="#"]');
      links.forEach((link) => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (!href || href === '#') return;

          const target = document.querySelector(href);
          if (!target) return;

          e.preventDefault();

          const offsetTop =
            target.getBoundingClientRect().top + window.pageYOffset;
          const startY = window.pageYOffset;
          const distance = offsetTop - startY;
          const duration = 800;
          const startTime = performance.now();

          const easeInOutCubic = (t) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

          const scrollStep = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeInOutCubic(progress);
            window.scrollTo(0, startY + distance * eased);

            if (progress < 1) {
              requestAnimationFrame(scrollStep);
            }
          };

          requestAnimationFrame(scrollStep);
        });
      });
    };

    return { init };
  })();

  // ========== Modal Promotion ==========
  const ModalPromotion = (() => {
    const init = () => {
      const modal = document.querySelector('.modal-promotion');
      if (!modal) return;

      const closeBtn = modal.querySelector('#modalClose, .modal-close, [data-close]');
      const maybeLaterBtn = modal.querySelector('#modalMaybeLater, .maybe-later, [data-maybe-later]');
      const overlay = modal.querySelector('.modal-overlay');

      const closeModal = () => modal.classList.remove('is-open');

      if (closeBtn) closeBtn.addEventListener('click', closeModal);
      if (maybeLaterBtn) maybeLaterBtn.addEventListener('click', closeModal);
      if (overlay) overlay.addEventListener('click', closeModal);

      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      setTimeout(() => {
        if (!sessionStorage.getItem('modalShown')) {
          modal.classList.add('is-open');
          sessionStorage.setItem('modalShown', '1');
        }
      }, 2500);
    };

    return { init };
  })();

  // ========== Init ==========
  const init = () => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', onReady);
    } else {
      onReady();
    }
  };

  const onReady = () => {
    Navbar.init();
    HeroSlider.init();
    Counters.init();
    Tabs.init();
    Accordion.init();
    PartnersCarousel.init();
    Forms.init();
    SmoothScroll.init();
    ModalPromotion.init();
    console.log('Rubi Digital JS loaded.');
  };

  return {
    Navbar,
    HeroSlider,
    Counters,
    Tabs,
    Accordion,
    PartnersCarousel,
    Forms,
    Toast,
    SmoothScroll,
    init,
  };
})();
