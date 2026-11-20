const BRAND = "Adeel Builds";
const EMAIL = "adeelbuilds@gmail.com";
const WHATSAPP_NUMBER = "+923019664099";
const WHATSAPP_LINK = "https://wa.me/923019664099?text=Hi%20Adeel%2C%20I%27m%20interested%20in%20a%20free%20mockup%20for%20my%20salon.";
const FORM_ENDPOINT = "";

(() => {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const touchDevice = window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
  const header = document.querySelector("[data-header]");
  const headerOffset = () => (header?.offsetHeight || 72) + 10;
  let lenis = null;
  let animationsReady = false;

  const safeSessionGet = (key) => {
    try { return sessionStorage.getItem(key); } catch (_) { return null; }
  };
  const safeSessionSet = (key, value) => {
    try { sessionStorage.setItem(key, value); } catch (_) { /* storage may be blocked */ }
  };

  function scrollToTarget(target) {
    const element = typeof target === "string" ? document.querySelector(target) : target;
    if (!element) return;
    if (lenis) {
      lenis.scrollTo(element, { offset: -headerOffset(), duration: 1.15 });
    } else {
      const top = element.getBoundingClientRect().top + window.scrollY - headerOffset();
      window.scrollTo({ top, behavior: reducedMotion.matches ? "auto" : "smooth" });
    }
  }

  function bindAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const hash = link.getAttribute("href");
        if (!hash || hash === "#") return;
        const target = document.querySelector(hash);
        if (!target) return;
        event.preventDefault();
        closeMenu();
        scrollToTarget(target);
        history.replaceState(null, "", hash);
      });
    });
  }

  function initSmoothScroll() {
    if (reducedMotion.matches || touchDevice || !window.Lenis || !window.gsap || !window.ScrollTrigger) return;
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, syncTouch: false });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  function initProgress() {
    const bar = document.querySelector(".scroll-progress span");
    if (!bar) return;
    let ticking = false;
    const update = () => {
      const range = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      bar.style.transform = `scaleX(${Math.min(1, window.scrollY / range)})`;
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  function closeMenu() {
    body.classList.remove("menu-open");
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".primary-nav");
    if (nav && window.innerWidth <= 900) nav.inert = true;
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.querySelector("span").textContent = "Menu";
    }
  }

  function initMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".primary-nav");
    if (!toggle) return;
    if (nav && window.innerWidth <= 900) nav.inert = true;
    toggle.addEventListener("click", () => {
      const open = !body.classList.contains("menu-open");
      body.classList.toggle("menu-open", open);
      if (nav) nav.inert = !open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector("span").textContent = open ? "Close" : "Menu";
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        closeMenu();
        if (nav) nav.inert = false;
      } else if (nav && !body.classList.contains("menu-open")) nav.inert = true;
    }, { passive: true });
  }

  function initImages() {
    document.querySelectorAll(".work-image img").forEach((img) => {
      if (!img.complete) img.classList.add("is-loading");
      const show = () => { img.classList.remove("is-loading"); img.classList.add("loaded"); };
      if (img.complete) show(); else img.addEventListener("load", show, { once: true });
    });
  }

  function initConceptViewer() {
    const viewer = document.querySelector("#concept-viewer");
    const links = [...document.querySelectorAll("[data-concept-link]")];
    if (!viewer || !links.length || typeof viewer.showModal !== "function") return;

    const source = viewer.querySelector(".concept-viewer-source");
    const image = viewer.querySelector(".concept-viewer-image");
    const title = viewer.querySelector("#concept-viewer-title");
    const description = viewer.querySelector(".concept-viewer-description");
    const count = viewer.querySelector(".concept-viewer-count");
    const previous = viewer.querySelector(".concept-viewer-prev");
    const next = viewer.querySelector(".concept-viewer-next");
    let activeIndex = 0;

    const render = (index) => {
      activeIndex = (index + links.length) % links.length;
      const link = links[activeIndex];
      const thumbnail = link.querySelector(".work-image img");
      const caption = link.querySelector(".work-caption");
      const href = link.getAttribute("href");
      source.srcset = href.replace(/\.jpg$/i, ".webp");
      source.sizes = "100vw";
      image.src = href;
      image.alt = thumbnail?.alt || "Salon website concept";
      title.textContent = caption?.querySelector("h3")?.textContent || "Website concept";
      description.textContent = caption?.querySelector("p")?.textContent || "";
      count.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(links.length).padStart(2, "0")}`;
      if (window.gsap && !reducedMotion.matches) {
        gsap.fromTo(image, { opacity: 0, scale: .985 }, { opacity: 1, scale: 1, duration: .45, ease: "power3.out", overwrite: true });
      }
    };

    links.forEach((link, index) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        render(index);
        viewer.showModal();
        body.classList.add("viewer-open");
        if (lenis) lenis.stop();
      });
    });

    viewer.querySelectorAll("[data-concept-close]").forEach((button) => button.addEventListener("click", () => viewer.close()));
    previous.addEventListener("click", () => render(activeIndex - 1));
    next.addEventListener("click", () => render(activeIndex + 1));
    viewer.addEventListener("click", (event) => { if (event.target === viewer) viewer.close(); });
    viewer.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") { event.preventDefault(); render(activeIndex - 1); }
      if (event.key === "ArrowRight") { event.preventDefault(); render(activeIndex + 1); }
    });
    viewer.addEventListener("close", () => {
      body.classList.remove("viewer-open");
      if (lenis) lenis.start();
    });
  }

  function finishPreloader(preloader, immediate = false) {
    if (!preloader || preloader.dataset.done === "true") return;
    preloader.dataset.done = "true";
    safeSessionSet("adeel-builds-intro", "seen");
    const reveal = () => {
      preloader.hidden = true;
      preloader.style.display = "none";
      if (!animationsReady) initAnimations();
    };
    if (immediate || reducedMotion.matches || !window.gsap) {
      reveal();
      return;
    }
    gsap.to(preloader, { yPercent: -100, duration: .45, ease: "power4.inOut", onComplete: reveal });
  }

  function initPreloader() {
    const preloader = document.querySelector(".preloader");
    const counter = document.querySelector(".preloader-count");
    if (!preloader) { initAnimations(); return; }
    const seen = safeSessionGet("adeel-builds-intro") === "seen";
    if (seen || reducedMotion.matches) { finishPreloader(preloader, true); return; }
    preloader.addEventListener("click", () => finishPreloader(preloader), { once: true });

    if (window.gsap) {
      const meter = { value: 0 };
      gsap.to(meter, {
        value: 100,
        duration: .85,
        ease: "power2.inOut",
        onUpdate: () => { counter.textContent = Math.round(meter.value); },
        onComplete: () => finishPreloader(preloader)
      });
    } else {
      let value = 0;
      const timer = setInterval(() => {
        value = Math.min(100, value + 8);
        counter.textContent = value;
        if (value === 100) { clearInterval(timer); finishPreloader(preloader, true); }
      }, 55);
    }
  }

  function splitReveal(target, options = {}) {
    if (!window.gsap) return;
    const element = typeof target === "string" ? document.querySelector(target) : target;
    if (!element) return;
    let lines = [element];
    if (window.SplitText) {
      try {
        const split = new SplitText(element, { type: "lines", mask: "lines", linesClass: "split-line" });
        lines = split.lines;
      } catch (_) { lines = [element]; }
    }
    gsap.from(lines, {
      yPercent: 110,
      opacity: 0,
      duration: options.duration || 1.05,
      stagger: options.stagger ?? .09,
      ease: options.ease || "expo.out",
      delay: options.delay || 0,
      scrollTrigger: options.scrollTrigger
    });
  }

  function initAnimations() {
    if (animationsReady) return;
    animationsReady = true;
    if (reducedMotion.matches || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    if (window.SplitText) gsap.registerPlugin(SplitText);
    ScrollTrigger.config({ ignoreMobileResize: true });

    splitReveal("#hero-title", { duration: 1.1 });
    gsap.from(".hero-kicker > *, .hero-copy, .hero-actions", { y: 24, opacity: 0, duration: .8, stagger: .08, delay: .4, ease: "power3.out" });
    gsap.from(".hero-badge", { scale: .72, opacity: 0, duration: .8, delay: .6, ease: "back.out(1.8)" });
    gsap.from(".hero-media", { scale: 1.08, clipPath: "inset(12% 0 0 0)", opacity: .35, duration: 1.15, delay: .35, ease: "expo.out" });

    document.querySelectorAll(".section-head .display-heading, .contact-heading-row .display-heading").forEach((heading) => {
      splitReveal(heading, { scrollTrigger: { trigger: heading, start: "top 86%", once: true }, duration: .9 });
    });
    document.querySelectorAll(".section-head > p, .about-copy, .care-plan, .reply-note, .contact-intro").forEach((block) => {
      gsap.from(block, { y: 24, opacity: 0, duration: .9, ease: "power3.out", scrollTrigger: { trigger: block, start: "top 88%", once: true } });
    });
    document.querySelectorAll(".section-rule").forEach((rule) => {
      gsap.from(rule, { scaleX: 0, ease: "none", scrollTrigger: { trigger: rule.parentElement, start: "top 92%", end: "top 45%", scrub: .5 } });
    });
    document.querySelectorAll(".work-image").forEach((image, index) => {
      gsap.from(image, { clipPath: index % 2 ? "inset(0 0 100% 0)" : "inset(0 100% 0 0)", duration: 1.1, ease: "power3.inOut", scrollTrigger: { trigger: image, start: "top 88%", once: true } });
    });
    document.querySelectorAll(".work-caption, .price-list article, .comparison article").forEach((item) => {
      gsap.from(item, { y: 24, opacity: 0, duration: .9, ease: "power3.out", scrollTrigger: { trigger: item, start: "top 90%", once: true } });
    });

    document.querySelectorAll("[data-speed]").forEach((media) => {
      gsap.to(media, { yPercent: Number(media.dataset.speed || 0), ease: "none", scrollTrigger: { trigger: media.closest("figure") || media, start: "top bottom", end: "bottom top", scrub: true } });
    });

    gsap.utils.toArray(".offer-step").forEach((step) => {
      gsap.from(step, {
        y: 24,
        opacity: 0,
        duration: .75,
        ease: "power3.out",
        scrollTrigger: { trigger: step, start: "top 90%", once: true }
      });
    });
    initCounters();
  }

  function initCounters() {
    document.querySelectorAll("[data-count]").forEach((node) => {
      const target = Number(node.dataset.count || 0);
      const prefix = node.dataset.prefix || "";
      const suffix = node.dataset.suffix || "";
      const state = { value: 0 };
      gsap.to(state, {
        value: target,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: { trigger: node, start: "top 90%", once: true },
        onUpdate: () => { node.textContent = `${prefix}${Math.round(state.value).toLocaleString("en-GB")}${suffix}`; }
      });
    });
  }

  function initCalculator() {
    const clients = document.querySelector("#clients");
    const booking = document.querySelector("#booking");
    if (!clients || !booking) return;
    const clientsValue = document.querySelector("#clients-value");
    const bookingValue = document.querySelector("#booking-value");
    const treatwell = document.querySelector("#treatwell-result");
    const fresha = document.querySelector("#fresha-result");
    const currency = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
    const values = { treatwell: 2520, fresha: 1200 };

    const paint = (animate = true) => {
      const count = Number(clients.value);
      const average = Number(booking.value);
      const next = { treatwell: count * average * 12 * .42, fresha: count * average * 12 * .2 };
      clientsValue.value = String(count);
      clientsValue.textContent = String(count);
      bookingValue.value = currency.format(average);
      bookingValue.textContent = currency.format(average);
      if (animate && window.gsap && !reducedMotion.matches) {
        gsap.to(values, { ...next, duration: .35, overwrite: true, ease: "power2.out", onUpdate: () => {
          treatwell.textContent = currency.format(values.treatwell);
          fresha.textContent = currency.format(values.fresha);
        }});
      } else {
        Object.assign(values, next);
        treatwell.textContent = currency.format(next.treatwell);
        fresha.textContent = currency.format(next.fresha);
      }
    };
    clients.addEventListener("input", () => paint());
    booking.addEventListener("input", () => paint());
    paint(false);
  }

  function initFaq() {
    document.querySelectorAll(".faq-item button").forEach((button) => {
      button.addEventListener("click", () => {
        const panel = document.getElementById(button.getAttribute("aria-controls"));
        const expanded = button.getAttribute("aria-expanded") === "true";
        if (!panel) return;
        button.setAttribute("aria-expanded", String(!expanded));
        if (expanded) {
          if (reducedMotion.matches) {
            panel.hidden = true;
            panel.style.height = "";
            return;
          }
          const height = panel.scrollHeight;
          panel.style.height = `${height}px`;
          panel.getBoundingClientRect();
          panel.style.height = "0px";
          const finish = () => { panel.hidden = true; panel.style.height = ""; panel.removeEventListener("transitionend", finish); };
          panel.addEventListener("transitionend", finish);
        } else {
          panel.hidden = false;
          if (reducedMotion.matches) {
            panel.style.height = "auto";
            return;
          }
          panel.style.height = "0px";
          panel.style.transition = "height .38s cubic-bezier(.2,.75,.25,1)";
          requestAnimationFrame(() => { panel.style.height = `${panel.scrollHeight}px`; });
          const finish = () => { panel.style.height = "auto"; panel.removeEventListener("transitionend", finish); };
          panel.addEventListener("transitionend", finish);
        }
      });
    });
  }

  function initContactForm() {
    const form = document.querySelector("#contact-form");
    const status = document.querySelector("#form-status");
    if (!form || !status) return;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const required = [...form.querySelectorAll("[required]")];
      const invalid = required.filter((field) => !field.value.trim());
      required.forEach((field) => field.setAttribute("aria-invalid", String(invalid.includes(field))));
      if (invalid.length) {
        status.textContent = "Please complete the three required fields.";
        invalid[0].focus();
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      const message = `Hi Adeel, I'm interested in a free mockup.\n\nName: ${data.name}\nSalon: ${data.salon}\nPhone / WhatsApp: ${data.phone}\nMessage: ${data.message || "No extra message"}`;
      if (!FORM_ENDPOINT) {
        const destination = new URL(WHATSAPP_LINK);
        destination.searchParams.set("text", message);
        status.textContent = "Opening WhatsApp with your details…";
        window.open(destination.toString(), "_blank", "noopener,noreferrer");
        return;
      }

      const button = form.querySelector("button[type='submit']");
      button.disabled = true;
      status.textContent = "Sending…";
      try {
        const response = await fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        if (!response.ok) throw new Error("Request failed");
        form.reset();
        status.textContent = "Thanks — Adeel will reply within one working day.";
        if (window.gsap && !reducedMotion.matches) gsap.fromTo(status, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .45 });
      } catch (_) {
        status.textContent = `Something went wrong. Please email ${EMAIL} instead.`;
      } finally {
        button.disabled = false;
      }
    });
  }

  function initPointerEffects() {
    if (touchDevice || window.innerWidth < 769) return;
    const dot = document.querySelector(".cursor-dot");
    const tag = document.querySelector(".work-cursor");
    if (!dot || !tag) return;
    let x = -100, y = -100, tx = -100, ty = -100;
    window.addEventListener("pointermove", (event) => { tx = event.clientX; ty = event.clientY; }, { passive: true });
    const render = () => {
      x += (tx - x) * .18; y += (ty - y) * .18;
      dot.style.transform = `translate3d(${x - 4}px,${y - 4}px,0)`;
      tag.style.transform = `translate3d(${x + 16}px,${y + 16}px,0)`;
      requestAnimationFrame(render);
    };
    render();
    document.querySelectorAll("a, button, input, textarea, .interactive-work").forEach((element) => {
      element.addEventListener("pointerenter", () => dot.classList.add("is-active"));
      element.addEventListener("pointerleave", () => dot.classList.remove("is-active"));
    });
    document.querySelectorAll(".interactive-work").forEach((item) => {
      item.addEventListener("pointerenter", () => { tag.style.opacity = "1"; });
      item.addEventListener("pointerleave", () => { tag.style.opacity = "0"; });
    });

    document.querySelectorAll(".magnetic").forEach((button) => {
      button.addEventListener("pointermove", (event) => {
        const rect = button.getBoundingClientRect();
        const dx = (event.clientX - (rect.left + rect.width / 2)) * .2;
        const dy = (event.clientY - (rect.top + rect.height / 2)) * .2;
        if (window.gsap) gsap.to(button, { x: dx, y: dy, duration: .25, overwrite: true });
      });
      button.addEventListener("pointerleave", () => {
        if (window.gsap) gsap.to(button, { x: 0, y: 0, duration: .7, ease: "elastic.out(1,.35)" });
      });
    });
  }

  function initMobileCta() {
    const cta = document.querySelector(".mobile-cta");
    const hero = document.querySelector(".hero");
    const contact = document.querySelector("#contact");
    const footer = document.querySelector(".site-footer");
    if (!cta || !hero || !contact || !footer) return;
    let heroPast = false, contactVisible = false, footerVisible = false;
    const update = () => {
      const visible = heroPast && !contactVisible && !footerVisible && window.innerWidth < 768;
      cta.classList.toggle("is-visible", visible);
      cta.setAttribute("aria-hidden", String(!visible));
      cta.inert = !visible;
    };
    new IntersectionObserver(([entry]) => { heroPast = !entry.isIntersecting && entry.boundingClientRect.bottom < 0; update(); }, { threshold: 0 }).observe(hero);
    new IntersectionObserver(([entry]) => { contactVisible = entry.isIntersecting; update(); }, { threshold: .08 }).observe(contact);
    new IntersectionObserver(([entry]) => { footerVisible = entry.isIntersecting; update(); }, { threshold: 0 }).observe(footer);
    window.addEventListener("resize", update, { passive: true });
  }

  function boot() {
    root.dataset.appReady = "true";
    root.dataset.brand = BRAND;
    bindAnchors();
    initMenu();
    initProgress();
    initImages();
    initConceptViewer();
    initCalculator();
    initFaq();
    initContactForm();
    initMobileCta();
    initPointerEffects();
    initSmoothScroll();
    const fontsReady = document.fonts?.ready || Promise.resolve();
    fontsReady.then(initPreloader).catch(initPreloader);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
