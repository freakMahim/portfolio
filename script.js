(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const intro = $("#intro");
  const music = $("#bgMusic");
  const musicToggle = $("#musicToggle");
  const copyButton = $("#emailCopy");
  const profileCard = $(".profile-card");

  let musicEnabled = false;

  function setMusicUI(playing) {
    musicEnabled = playing;
    musicToggle.classList.toggle("is-playing", playing);
    musicToggle.setAttribute("aria-pressed", String(playing));
    musicToggle.setAttribute("aria-label", playing ? "Mute music" : "Turn music on");
  }

  async function playMusic() {
    try {
      music.volume = 0.16;
      await music.play();
      setMusicUI(true);
    } catch (error) {
      // Browser policy or an unavailable file: keep the site usable without audio.
      setMusicUI(false);
    }
  }

  function stopMusic() {
    music.pause();
    setMusicUI(false);
  }

  function enterSite(withMusic) {
    if (withMusic) playMusic();
    else stopMusic();

    document.body.classList.remove("locked");
    intro.classList.add("is-leaving");
    window.setTimeout(() => intro.remove(), 950);
  }

  $$(".intro-choice").forEach((button) => {
    button.addEventListener("click", () => enterSite(button.dataset.audio === "on"));
  });

  musicToggle.addEventListener("click", () => {
    if (musicEnabled) stopMusic();
    else playMusic();
  });

  // Keyboard access for the intro.
  document.addEventListener("keydown", (event) => {
    if (!intro || !document.body.contains(intro)) return;
    if (event.key === "Enter") enterSite(true);
    if (event.key === "Escape") enterSite(false);
  });

  // Smooth email copy + mail fallback.
  copyButton.addEventListener("click", async () => {
    const email = "freakmahim@gmail.com";
    let copied = false;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
        copied = true;
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = email;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        copied = document.execCommand("copy");
        textarea.remove();
      }
    } catch (_) {}

    const state = $(".copy-state", copyButton);
    state.textContent = copied ? "copied ✓" : "open mail";
    if (!copied) window.location.href = "mailto:" + email;
    window.setTimeout(() => { state.textContent = "copy"; }, 1800);
  });

  // Staggered scroll reveals.
  const revealItems = $$(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const siblings = $$(".reveal", entry.target.closest("section") || document);
        const index = Math.max(0, siblings.indexOf(entry.target));
        entry.target.style.transitionDelay = `${Math.min(index * 70, 350)}ms`;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealItems.forEach((el) => observer.observe(el));
  }

  // Desktop-only profile tilt. Touch devices remain static.
  if (profileCard && !reducedMotion && window.matchMedia("(pointer:fine)").matches) {
    profileCard.addEventListener("pointermove", (event) => {
      const rect = profileCard.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      profileCard.style.transform = `rotateY(${x * 5}deg) rotateX(${y * -5}deg) translateZ(0)`;
    });
    profileCard.addEventListener("pointerleave", () => {
      profileCard.style.transform = "rotateY(0deg) rotateX(0deg)";
    });
  }

  // Subtle magnetic response for primary buttons.
  if (!reducedMotion && window.matchMedia("(pointer:fine)").matches) {
    $$(".btn-primary").forEach((button) => {
      button.addEventListener("pointermove", (event) => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        button.style.transform = `translate(${x * .035}px, ${y * .035}px) translateY(-2px)`;
      });
      button.addEventListener("pointerleave", () => {
        button.style.transform = "";
      });
    });
  }

  // Make external links explicitly safe.
  $$('a[target="_blank"]').forEach((link) => {
    link.rel = "noopener noreferrer";
  });
})();
