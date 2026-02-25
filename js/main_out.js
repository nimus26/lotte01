document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const mainTitText = $(".main_visual .main_tit p");
  const mainTitCta = $(".main_visual .btn_to_card");
  if (mainTitText && typeof window.gsap !== "undefined") {
    gsap.set(mainTitText, {
      clipPath: "inset(0 50% 0 50%)",
      WebkitClipPath: "inset(0 50% 0 50%)",
      opacity: 0,
      filter: "blur(6px)",
      willChange: "clip-path, opacity, filter",
    });

    if (mainTitCta) {
      gsap.set(mainTitCta, { opacity: 0, y: 14, willChange: "opacity, transform" });
    }

    const introTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    introTl.to(mainTitText, {
      duration: 1.05,
      clipPath: "inset(0 0% 0 0%)",
      WebkitClipPath: "inset(0 0% 0 0%)",
      opacity: 1,
      filter: "blur(0px)",
      clearProps: "willChange",
    });

    if (mainTitCta) {
      introTl.to(
        mainTitCta,
        { duration: 0.55, opacity: 1, y: 0, clearProps: "willChange" },
        "-=0.18"
      );
    }
  }

  const eventTrack = $(".event .contents");
  const eventItems = $$(".event .contents > li");
  if (eventTrack && eventItems.length > 1) {
    let eventIndex = 0;
    const totalEvents = eventItems.length;

    const updateEventSlide = () => {
      eventItems.forEach((item, idx) => {
        item.style.transform = `translateX(-${eventIndex * 100}%)`;
        item.setAttribute("aria-hidden", idx === eventIndex ? "false" : "true");
      });
    };

    const moveEventSlide = (step) => {
      eventIndex = (eventIndex + step + totalEvents) % totalEvents;
      updateEventSlide();
    };

    $$(".event .event_prev").forEach((btn) => {
      btn.addEventListener("click", () => moveEventSlide(-1));
    });
    $$(".event .event_next").forEach((btn) => {
      btn.addEventListener("click", () => moveEventSlide(1));
    });

    updateEventSlide();
  }

 

  const cardThumbs = $$(".best_card .bottom .card_thumb");
  if (!cardThumbs.length) return;

  const mainCardImg = $(".best_card .card01 img");
  const mainTextBox = $(".best_card .txts");
  const mainTextWrap = $(".best_card .txts .txts_inner");
  const mainTags = $$(".best_card .txts .tag p");
  const mainTitle = $(".best_card .txts h3");
  const mainDesc = $(".best_card .txts .card_desc");
  const mainBenefit = $(".best_card .txts .card_benefit");
  const mainMore = $(".best_card .txts .more");
  let switchTimer = null;

  const applyMainCardData = (thumb) => {
    if (!mainCardImg || !thumb) return;

    const { src, alt, tag1, tag2, title, desc, benefit, link } = thumb.dataset;
    if (src) mainCardImg.src = src;
    if (alt) mainCardImg.alt = alt;
    if (mainTags[0] && tag1) mainTags[0].textContent = tag1;
    if (mainTags[1] && tag2) mainTags[1].textContent = tag2;
    if (mainTitle && title) mainTitle.textContent = title;
    if (mainDesc && desc) mainDesc.textContent = desc;
    if (mainBenefit && benefit) mainBenefit.textContent = benefit;
    if (mainMore && link) mainMore.setAttribute("href", link);
  };

  const setActiveThumb = (target) => {
    cardThumbs.forEach((thumb) => {
      const isActive = thumb === target;
      thumb.classList.toggle("is_active", isActive);
      thumb.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  };

  const switchMainCard = (thumb, animate = false) => {
    if (!thumb) return;

    const targets = [mainCardImg, mainTextBox, mainTextWrap].filter(Boolean);
    if (!animate || !targets.length) {
      applyMainCardData(thumb);
      return;
    }

    if (switchTimer) clearTimeout(switchTimer);
    targets.forEach((el) => el.classList.add("is_switching"));

    switchTimer = window.setTimeout(() => {
      applyMainCardData(thumb);
      requestAnimationFrame(() => {
        targets.forEach((el) => el.classList.remove("is_switching"));
      });
      switchTimer = null;
    }, 150);
  };

  cardThumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      if (thumb.classList.contains("is_active")) return;
      setActiveThumb(thumb);
      switchMainCard(thumb, true);
    });
  });

  const initialActive = $(".best_card .bottom .card_thumb.is_active") || cardThumbs[0];
  setActiveThumb(initialActive);
  switchMainCard(initialActive, false);
  
  const lifeSwiperEl = $(".life .swiper");
  if (lifeSwiperEl && typeof Swiper !== "undefined") {
    const slideCount = $$(".life .swiper .swiper-slide").length;

    new Swiper(lifeSwiperEl, {
      loop: true,
      slidesPerView: "auto",
      spaceBetween: 30,
      speed: 10000,
      watchOverflow: false,
      loopAdditionalSlides: slideCount,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      on: {
        init() {
          this.wrapperEl.style.transitionTimingFunction = "linear";
        },
        slideChangeTransitionStart() {
          this.wrapperEl.style.transitionTimingFunction = "linear";
        },
      },
    });
  }

  const selectBtn = document.querySelector(".select_box button");
  if (selectBtn) {
    selectBtn.addEventListener("click", () => {
      document.querySelector(".select_box")?.classList.toggle("on");
    });
  }
});


