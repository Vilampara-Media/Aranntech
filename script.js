/**
 * Arann Tech - Website Interactive Scripts
 * Handles mobile navigation, accordion, form submissions, and modals
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('is-active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('is-active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when clicking regular nav links or mobile CTA
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        // Don't close if tapping a dropdown trigger with children
        if (link.parentElement.classList.contains('nav-item-dropdown') && link.classList.contains('nav-link')) {
          return;
        }
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('is-active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 1b. Dropdown Submenu Interaction (Services & About)
  const dropdownItems = document.querySelectorAll('.nav-item-dropdown');
  dropdownItems.forEach(drop => {
    const trigger = drop.querySelector('.nav-link');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        // On mobile screen (<= 1024px), toggle dropdown
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          e.stopPropagation();
          dropdownItems.forEach(other => {
            if (other !== drop) other.classList.remove('is-open');
          });
          drop.classList.toggle('is-open');
        }
      });
    }
  });

  // Close dropdown when clicking anywhere outside
  document.addEventListener('click', (e) => {
    dropdownItems.forEach(drop => {
      if (!drop.contains(e.target)) {
        drop.classList.remove('is-open');
      }
    });
  });

  // 2. FAQ Accordion Functionality (Supports both .faq-item and .faq-card)
  const faqContainers = document.querySelectorAll('.faq-item, .faq-card');
  faqContainers.forEach(item => {
    const questionBtn = item.querySelector('.faq-question, .faq-btn');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close sibling items
        const parentList = item.parentElement;
        if (parentList) {
          parentList.querySelectorAll('.faq-item, .faq-card').forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
            }
          });
        }

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
        } else {
          item.classList.add('active');
        }
      });
    }
  });

  // 3. Consultation / Contact Form Handler
  const contactForm = document.getElementById('consultationForm');
  const feedbackModal = document.getElementById('feedbackModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerText : 'Submit';
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Submitting Request...';
      }

      // Simulate sending to backend / CRM
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalText;
        }

        contactForm.reset();

        if (feedbackModal) {
          feedbackModal.style.display = 'flex';
        } else {
          alert('Thank you for reaching out to Arann Tech! Our advisory team will review your requirements and respond within 1 business day under mutual confidentiality.');
        }
      }, 700);
    });
  }

  // 4. AI Checklist Download Form Handler
  const leadMagnetForm = document.getElementById('leadMagnetForm');
  if (leadMagnetForm) {
    leadMagnetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = leadMagnetForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerText : 'Download Checklist';
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Preparing Download...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = 'Checklist Sent!';
        }
        leadMagnetForm.reset();
        alert('Success! Your copy of the "10-Point AI Security Guardrails Checklist" has been sent to your email.');
      }, 800);
    });
  }

  // Close modal button
  if (closeModalBtn && feedbackModal) {
    closeModalBtn.addEventListener('click', () => {
      feedbackModal.style.display = 'none';
    });
  }

  if (feedbackModal) {
    feedbackModal.addEventListener('click', (e) => {
      if (e.target === feedbackModal) {
        feedbackModal.style.display = 'none';
      }
    });
  }

  // 5. Smart Sticky Header: Hides on scroll down, reveals on scroll up
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    let ticking = false;
    const scrollThreshold = 8; // Filter out tiny micro-scrolls

    const updateHeader = () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      const navMenu = document.getElementById('navMenu');
      const isMobileMenuOpen = navMenu && navMenu.classList.contains('open');

      // Keep header visible if mobile menu or dropdown is active
      if (isMobileMenuOpen) {
        siteHeader.classList.remove('header-hidden');
        lastScrollY = currentScrollY;
        ticking = false;
        return;
      }

      // If near top of page (hero area)
      if (currentScrollY <= 30) {
        siteHeader.classList.remove('is-sticky');
        siteHeader.classList.remove('header-hidden');
      } else {
        // Scrolled down: enable frosted sticky background
        siteHeader.classList.add('is-sticky');

        const scrollDiff = currentScrollY - lastScrollY;

        // Scrolling Down: Hide header
        if (scrollDiff > scrollThreshold && currentScrollY > 120) {
          siteHeader.classList.add('header-hidden');
        } 
        // Scrolling Up: Reveal header
        else if (scrollDiff < -scrollThreshold) {
          siteHeader.classList.remove('header-hidden');
        }
      }

      lastScrollY = Math.max(0, currentScrollY);
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });

    // Initial check on load
    updateHeader();
  }
});

