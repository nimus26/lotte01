document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const header = $("#header");
  if (!header) return;

  const gnbItems = $$("#gnb .menu > .menu_item");
  const allMenu = $(".all_menu");
  const allMenuGrid = $(".all_menu_grid");
  const btnHam = $(".ham_menu");
  const btnCloseAll = $(".all_menu_close");

  let isSubOpen = false;
  let lastScrollY = window.scrollY;

  const setDisplay = (el, isOpen) => {
    if (!el) return;
    el.style.removeProperty("opacity");
    el.style.removeProperty("transform");
    el.style.display = isOpen ? "block" : "none";
  };

  const closeSubMenus = (except = null) => {
    gnbItems.forEach((item) => {
      if (item === except) return;
      item.classList.remove("is_active");
      setDisplay(item.querySelector(".sub_menu"), false);
    });
    isSubOpen = Boolean(except);
  };

  const openSubMenu = (item) => {
    closeSubMenus(item);
    item.classList.add("is_active");
    setDisplay(item.querySelector(".sub_menu"), true);
    isSubOpen = true;
    syncHeaderBlur();
  };

  gnbItems.forEach((item) => {
    if (!item.querySelector(".sub_menu")) return;
    item.addEventListener("mouseenter", () => openSubMenu(item));
  });

  header.addEventListener("mouseleave", () => {
    closeSubMenus();
    syncHeaderBlur();
  });

  const buildAllMenuGrid = () => {
    if (!allMenuGrid) return;
    allMenuGrid.textContent = "";

    gnbItems.forEach((item) => {
      const dep1 = item.querySelector(".dep1");
      if (!dep1) return;

      const col = document.createElement("section");
      col.className = "all_menu_col";

      const tit = document.createElement("h3");
      tit.className = "all_menu_tit";
      tit.append(dep1.cloneNode(true));
      col.append(tit);

      const dep2List = item.querySelector(".sub_menu .dep2_list");
      if (dep2List) {
        const dep2Wrap = document.createElement("ul");
        dep2Wrap.className = "all_menu_dep2_list";

        Array.from(dep2List.children).forEach((dep2) => {
          if (!dep2.classList.contains("dep2")) return;

          const dep2Item = document.createElement("li");
          dep2Item.className = "all_menu_dep2";

          const dep2Anchor = dep2.querySelector(":scope > a") || dep2.querySelector("a");
          if (dep2Anchor) dep2Item.append(dep2Anchor.cloneNode(true));

          const dep3Links = Array.from(dep2.querySelectorAll(":scope > .dep3 > li > a"));
          if (dep3Links.length) {
            const dep3List = document.createElement("ul");
            dep3List.className = "dep3";

            dep3Links.forEach((link) => {
              const li = document.createElement("li");
              li.append(link.cloneNode(true));
              dep3List.append(li);
            });

            dep2Item.append(dep3List);
          }

          dep2Wrap.append(dep2Item);
        });

        col.append(dep2Wrap);
      }

      allMenuGrid.append(col);
    });
  };

  const toggleAllMenu = (open) => {
    if (!allMenu) return;

    allMenu.classList.toggle("is_open", open);
    allMenu.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.classList.toggle("all_menu_open", open);
    header.classList.toggle("is_all_menu_active", open);

    if (open) {
      closeSubMenus();
      header.classList.remove("is_header_blur", "is_header_hidden");
    }

    syncHeaderBlur();
  };

  btnHam?.addEventListener("click", (e) => {
    e.preventDefault();
    toggleAllMenu(true);
  });

  btnCloseAll?.addEventListener("click", () => toggleAllMenu(false));

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    toggleAllMenu(false);
    closeSubMenus();
    syncHeaderBlur();
  });

  function syncHeaderBlur() {
    const top = window.scrollY <= 10;
    const allOpen = allMenu?.classList.contains("is_open");

    if (allOpen) {
      header.classList.remove("is_header_blur", "is_header_hidden");
      return;
    }

    header.classList.toggle("is_header_blur", !top && !isSubOpen);
    if (top) header.classList.remove("is_header_hidden");
  }

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    const top = y <= 10;

    syncHeaderBlur();
    if (!top) header.classList.toggle("is_header_hidden", y > lastScrollY);

    lastScrollY = y;
  });

  buildAllMenuGrid();
  syncHeaderBlur();

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

    const targets = [mainCardImg, mainTextWrap].filter(Boolean);
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
});
