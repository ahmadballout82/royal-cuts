
"use strict";

/* ROYAL CUTS COMPLETE JAVASCRIPT */

document.addEventListener("DOMContentLoaded", () => {

  /* HEADER */

  const header = document.getElementById("header");

  function updateHeader() {
    if (!header) return;

    header.classList.toggle(
      "scrolled",
      window.scrollY > 40
    );
  }

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });


  /* MOBILE MENU */

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    menuToggle.classList.remove("active");
    navLinks.classList.remove("active");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");

    document.body.classList.remove("menu-open");
  }

  function openMenu() {
    if (!menuToggle || !navLinks) return;

    menuToggle.classList.add("active");
    navLinks.classList.add("active");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation");

    document.body.classList.add("menu-open");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      if (navLinks.classList.contains("active")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", event => {
      if (
        navLinks.classList.contains("active") &&
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 991) closeMenu();
    });
  }


  /* ACTIVE NAVIGATION */

  const sections = document.querySelectorAll("main section[id]");
  const navigationLinks = document.querySelectorAll(".nav-link");

  function updateActiveNavigation() {
    let currentSection = "home";
    const position = window.scrollY + 170;

    sections.forEach(section => {
      if (position >= section.offsetTop) {
        currentSection = section.id;
      }
    });

    navigationLinks.forEach(link => {
      const active =
        link.getAttribute("href") === "#" + currentSection;

      link.classList.toggle("active", active);

      if (active) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  updateActiveNavigation();

  window.addEventListener(
    "scroll",
    updateActiveNavigation,
    { passive: true }
  );


  /* SERVICE BOOKING BUTTONS */

  const serviceSelect = document.getElementById("service");
  const bookingSection = document.getElementById("booking");
  const serviceButtons = document.querySelectorAll(".service-book");

  serviceButtons.forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();

      const selectedService = button.dataset.service;

      if (serviceSelect && selectedService) {
        const optionExists = Array.from(
          serviceSelect.options
        ).some(option => option.value === selectedService);

        if (optionExists) {
          serviceSelect.value = selectedService;
          serviceSelect.dispatchEvent(
            new Event("change", { bubbles: true })
          );
        }
      }

      if (bookingSection) {
        bookingSection.scrollIntoView({
          behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches ? "auto" : "smooth",
          block: "start"
        });
      }

      if (window.history.replaceState) {
        window.history.replaceState(null, "", "#booking");
      }
    });
  });


  /* SMOOTH SCROLL */

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    if (link.classList.contains("service-book")) return;

    link.addEventListener("click", event => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const target = document.getElementById(
        href.substring(1)
      );

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth",
        block: "start"
      });

      closeMenu();

      if (window.history.replaceState) {
        window.history.replaceState(null, "", href);
      }
    });
  });


  /* ANIMATED COUNTERS */

  const counters = document.querySelectorAll("[data-count]");

  function animateCounter(element) {
    if (element.dataset.animated === "true") return;

    const target = Number(element.dataset.count);
    const suffix = element.dataset.suffix || "";

    if (!Number.isFinite(target)) return;

    element.dataset.animated = "true";

    const duration = 1800;
    const start = performance.now();

    if (window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches) {
      element.textContent =
        target.toLocaleString("en-US") + suffix;
      return;
    }

    function frame(now) {
      const progress = Math.min(
        (now - start) / duration,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 3);

      const value = Math.round(target * eased);

      element.textContent =
        value.toLocaleString("en-US") + suffix;

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    counters.forEach(counter => observer.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }


  /* CUSTOMER REVIEWS */

  const reviews = Array.from(
    document.querySelectorAll(".testimonial-slide")
  );

  const prevReview = document.getElementById("prevReview");
  const nextReview = document.getElementById("nextReview");
  const reviewCounter = document.getElementById("reviewCounter");

  let currentReview = 0;
  let reviewTimer = null;

  function showReview(index) {
    if (!reviews.length) return;

    currentReview =
      (index + reviews.length) % reviews.length;

    reviews.forEach((review, i) => {
      const active = i === currentReview;

      review.classList.toggle("active", active);
      review.setAttribute("aria-hidden", String(!active));
    });

    if (reviewCounter) {
      reviewCounter.textContent =
        String(currentReview + 1).padStart(2, "0") +
        " / " +
        String(reviews.length).padStart(2, "0");
    }
  }

  function stopAutoplay() {
    if (reviewTimer !== null) {
      clearInterval(reviewTimer);
      reviewTimer = null;
    }
  }

  function startAutoplay() {
    stopAutoplay();

    if (reviews.length < 2 || document.hidden) return;

    if (window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches) return;

    reviewTimer = setInterval(() => {
      showReview(currentReview + 1);
    }, 6500);
  }

  if (reviews.length) {
    showReview(0);
    startAutoplay();

    if (prevReview) {
      prevReview.addEventListener("click", () => {
        showReview(currentReview - 1);
        startAutoplay();
      });
    }

    if (nextReview) {
      nextReview.addEventListener("click", () => {
        showReview(currentReview + 1);
        startAutoplay();
      });
    }

    const slider = document.querySelector(".testimonial-slider");

    if (slider) {
      slider.addEventListener("mouseenter", stopAutoplay);
      slider.addEventListener("mouseleave", startAutoplay);
      slider.addEventListener("focusin", stopAutoplay);

      slider.addEventListener("focusout", event => {
        if (!slider.contains(event.relatedTarget)) {
          startAutoplay();
        }
      });
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });
  }


  /* GALLERY LIGHTBOX */

  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");

  let previousFocus = null;

  function openLightbox(image) {
    if (!lightbox || !lightboxImage || !image) return;

    previousFocus = document.activeElement;

    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "Gallery image";

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.classList.add("lightbox-open");

    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImage) return;

    if (!lightbox.classList.contains("active")) return;

    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");

    document.body.classList.remove("lightbox-open");

    lightboxImage.removeAttribute("src");

    if (
      previousFocus &&
      typeof previousFocus.focus === "function"
    ) {
      previousFocus.focus();
    }
  }

  galleryItems.forEach(item => {
    item.addEventListener("click", () => {
      openLightbox(item.querySelector("img"));
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", event => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (lightbox && lightbox.classList.contains("active")) {
        closeLightbox();
      } else if (
        navLinks &&
        navLinks.classList.contains("active")
      ) {
        closeMenu();

        if (menuToggle) menuToggle.focus();
      }
    }

    if (
      event.key === "Tab" &&
      lightbox &&
      lightbox.classList.contains("active")
    ) {
      event.preventDefault();

      if (lightboxClose) lightboxClose.focus();
    }
  });


  /* IMAGE FALLBACK */

  const images = document.querySelectorAll(
    "img:not(#lightboxImage)"
  );

  images.forEach(image => {
    image.addEventListener("error", () => {
      const fallback = image.dataset.fallback;

      if (
        fallback &&
        image.dataset.fallbackUsed !== "true"
      ) {
        image.dataset.fallbackUsed = "true";
        image.src = fallback;
      } else {
        image.style.backgroundColor = "#25221d";
        image.style.opacity = "0.5";
      }
    });

    if (image.complete && image.naturalWidth === 0) {
      image.dispatchEvent(new Event("error"));
    }
  });


  /* BOOKING FORM */

  const bookingForm = document.getElementById("bookingForm");
  const bookingDate = document.getElementById("date");
  const bookingTime = document.getElementById("time");
  const formMessage = document.getElementById("formMessage");

  function localDateString(date) {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function updateMinimumDate() {
    if (!bookingDate) return;

    const today = localDateString(new Date());

    bookingDate.min = today;

    if (bookingDate.value && bookingDate.value < today) {
      bookingDate.value = "";
    }
  }

  updateMinimumDate();

  window.addEventListener("focus", updateMinimumDate);

  function cleanText(value) {
    return String(value || "")
      .trim()
      .replace(/\s+/g, " ");
  }

  if (bookingForm) {
    bookingForm.addEventListener("submit", event => {
      event.preventDefault();

      updateMinimumDate();

      if (!bookingForm.reportValidity()) return;

      const nameInput = document.getElementById("fullName");
      const phoneInput = document.getElementById("phone");

      const fullName = cleanText(nameInput?.value);
      const phone = cleanText(phoneInput?.value);
      const service = serviceSelect?.value || "";
      const date = bookingDate?.value || "";
      const time = bookingTime?.value || "";

      if (!fullName || !phone || !service || !date || !time) {
        if (formMessage) {
          formMessage.textContent =
            "Please complete all required fields";
        }
        return;
      }

      if (!/^[+0-9()\-\s]{7,25}$/.test(phone)) {
        if (formMessage) {
          formMessage.textContent =
            "Please enter a valid phone number";
        }

        phoneInput.focus();
        return;
      }

      const selectedDate = new Date(date + "T12:00:00");

      if (Number.isNaN(selectedDate.getTime())) {
        if (formMessage) {
          formMessage.textContent =
            "Please select a valid date";
        }
        return;
      }

      const formattedDate = selectedDate.toLocaleDateString(
        "en-US",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        }
      );

      const requestText = [
        "ROYAL CUTS",
        "BOOKING REQUEST PREVIEW",
        "",
        "Name  " + fullName,
        "Phone  " + phone,
        "Service  " + service,
        "Date  " + formattedDate,
        "Time  " + time,
        "",
        "This is a portfolio demonstration",
        "No real appointment has been sent"
      ].join("\n");

      if (formMessage) {
        formMessage.textContent =
          "Your booking preview is ready";
      }

      showBookingPreview(requestText);
    });
  }


  /* BOOKING PREVIEW WINDOW */

  function showBookingPreview(requestText) {
    let overlay = document.getElementById(
      "bookingPreviewOverlay"
    );

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "bookingPreviewOverlay";

      overlay.style.cssText = `
        position:fixed;
        inset:0;
        z-index:5000;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;
        background:rgba(0,0,0,0.88);
        backdrop-filter:blur(8px);
      `;

      const dialog = document.createElement("div");

      dialog.setAttribute("role", "dialog");
      dialog.setAttribute("aria-modal", "true");
      dialog.setAttribute(
        "aria-label",
        "Booking request preview"
      );

      dialog.style.cssText = `
        width:100%;
        max-width:500px;
        max-height:90vh;
        overflow-y:auto;
        padding:35px;
        background:#211e1a;
        color:#f9f6f0;
        border:1px solid #d4af69;
        box-shadow:0 25px 80px rgba(0,0,0,.6);
      `;

      const title = document.createElement("h2");
      title.textContent = "BOOKING PREVIEW";

      title.style.cssText = `
        margin-bottom:20px;
        color:#d4af69;
        font-family:Georgia,serif;
        font-size:28px;
        text-align:center;
      `;

      const details = document.createElement("pre");
      details.id = "bookingPreviewText";

      details.style.cssText = `
        white-space:pre-wrap;
        overflow-wrap:anywhere;
        font-family:Arial,sans-serif;
        font-size:14px;
        line-height:2;
        color:#e8e0d3;
      `;

      const notice = document.createElement("p");
      notice.textContent =
        "Demo only  No appointment has been submitted";

      notice.style.cssText = `
        margin-top:18px;
        color:#d4af69;
        font-size:12px;
        text-align:center;
      `;

      const buttons = document.createElement("div");

      buttons.style.cssText = `
        display:flex;
        flex-wrap:wrap;
        gap:12px;
        margin-top:25px;
      `;

      const copyButton = document.createElement("button");
      copyButton.type = "button";
      copyButton.textContent = "COPY REQUEST";

      const closeButton = document.createElement("button");
      closeButton.type = "button";
      closeButton.textContent = "CLOSE";

      [copyButton, closeButton].forEach(button => {
        button.style.cssText = `
          flex:1;
          min-width:140px;
          min-height:45px;
          border:0;
          padding:12px;
          font-size:12px;
          font-weight:700;
          letter-spacing:1px;
          cursor:pointer;
        `;
      });

      copyButton.style.background = "#d4af69";
      copyButton.style.color = "#111";

      closeButton.style.background = "#36312a";
      closeButton.style.color = "#fff";

      copyButton.addEventListener("click", async () => {
        const text = details.textContent;

        try {
          if (
            navigator.clipboard &&
            window.isSecureContext
          ) {
            await navigator.clipboard.writeText(text);
          } else {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";

            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();

            const copied = document.execCommand("copy");
            textarea.remove();

            if (!copied) throw new Error("Copy failed");
          }

          copyButton.textContent = "COPIED";

          setTimeout(() => {
            copyButton.textContent = "COPY REQUEST";
          }, 2000);
        } catch {
          copyButton.textContent = "COPY FAILED";

          setTimeout(() => {
            copyButton.textContent = "COPY REQUEST";
          }, 2000);
        }
      });

      function closePreview() {
        overlay.style.display = "none";
        document.body.style.overflow = "";

        if (bookingForm) {
          const submitButton = bookingForm.querySelector(
            'button[type="submit"]'
          );

          if (submitButton) submitButton.focus();
        }
      }

      closeButton.addEventListener("click", closePreview);

      overlay.addEventListener("click", event => {
        if (event.target === overlay) closePreview();
      });

      document.addEventListener("keydown", event => {
        if (
          event.key === "Escape" &&
          overlay.style.display !== "none"
        ) {
          closePreview();
        }

        if (
          event.key === "Tab" &&
          overlay.style.display !== "none"
        ) {
          const focusable = [copyButton, closeButton];
          const current = focusable.indexOf(
            document.activeElement
          );

          if (event.shiftKey && current <= 0) {
            event.preventDefault();
            closeButton.focus();
          } else if (!event.shiftKey && current === 1) {
            event.preventDefault();
            copyButton.focus();
          }
        }
      });

      buttons.append(copyButton, closeButton);

      dialog.append(title, details, notice, buttons);

      overlay.appendChild(dialog);
      document.body.appendChild(overlay);
    }

    const details = document.getElementById(
      "bookingPreviewText"
    );

    if (details) {
      details.textContent = requestText;
    }

    overlay.style.display = "flex";
    document.body.style.overflow = "hidden";

    const firstButton = overlay.querySelector("button");

    if (firstButton) firstButton.focus();
  }


  /* FOOTER YEAR */

  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

});
