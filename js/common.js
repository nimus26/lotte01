document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  const header = $("#header");
  if (!header) return;

  const gnbItems = $$("#gnb .menu > .menu_item");
  const allMenu = $(".all_menu");
  const allMenuGrid = $(".all_menu_grid");
  const btnHam = $(".ham_menu");
  const btnCloseAll = $(".all_menu_close");

  const hasGSAP = typeof window.gsap !== "undefined";

  let isSubOpen = false;
  let lastScrollY = window.scrollY;

  // ---- helpers (sub menu) ----
  const animateShow = (el) => {
    if (!el) return;
    if (!hasGSAP) return (el.style.display = "block");
    gsap.killTweensOf(el);
    gsap.fromTo(el, { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, display: "block", duration: 0.25, ease: "power2.out" });
  };

  const animateHide = (el) => {
    if (!el) return;
    if (!hasGSAP) return (el.style.display = "none");
    gsap.killTweensOf(el);
    gsap.to(el, {
      autoAlpha: 0,
      y: -10,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => (el.style.display = "none"),
    });
  };

  const closeAllSubMenus = () => {
    gnbItems.forEach((item) => {
      item.classList.remove("is_active");
      animateHide(item.querySelector(".sub_menu"));
    });
    isSubOpen = false;
  };

  const openSubMenu = (item) => {
    // 다른 메뉴 닫기
    gnbItems.forEach((el) => {
      if (el === item) return;
      el.classList.remove("is_active");
      animateHide(el.querySelector(".sub_menu"));
    });

    // 내 메뉴 열기
    item.classList.add("is_active");
    animateShow(item.querySelector(".sub_menu"));

    isSubOpen = true;
    header.classList.add("is_header_blur");
  };

  // ---- GNB hover (item별 mouseenter만) ----
  gnbItems.forEach((item) => {
    if (!item.querySelector(".sub_menu")) return;
    item.addEventListener("mouseenter", () => openSubMenu(item));
  });

  // header mouseleave는 1번만
  header.addEventListener("mouseleave", () => {
    closeAllSubMenus();
    syncHeaderBlur();
  });

  // ---- All menu (hamburger) ----
  const buildAllMenuGrid = () => {
    if (!allMenuGrid || !gnbItems.length) return;
    allMenuGrid.innerHTML = "";

    gnbItems.forEach((item) => {
      const dep1 = item.querySelector(".dep1");
      if (!dep1) return;

      const col = document.createElement("section");
      col.className = "all_menu_col";

      const tit = document.createElement("h3");
      tit.className = "all_menu_tit";

      const titLink = dep1.cloneNode(true);
      tit.appendChild(titLink);
      col.appendChild(tit);

      const dep2List = item.querySelector(".sub_menu .dep2_list");
      if (dep2List) {
        const dep2Wrap = document.createElement("ul");
        dep2Wrap.className = "all_menu_dep2_list";

        [...dep2List.children].forEach((dep2) => {
          if (!dep2.classList.contains("dep2")) return;

          const dep2Item = document.createElement("li");
          dep2Item.className = "all_menu_dep2";

          const dep2Anchor = dep2.querySelector("a");
          if (dep2Anchor) dep2Item.appendChild(dep2Anchor.cloneNode(true));

          const dep3 = dep2.querySelector(".dep3");
          if (dep3) {
            const dep3List = document.createElement("ul");
            dep3List.className = "dep3";

            [...dep3.querySelectorAll(":scope > li > a")].forEach((a) => {
              const li = document.createElement("li");
              li.appendChild(a.cloneNode(true));
              dep3List.appendChild(li);
            });

            if (dep3List.children.length) dep2Item.appendChild(dep3List);
          }

          dep2Wrap.appendChild(dep2Item);
        });

        col.appendChild(dep2Wrap);
      }

      allMenuGrid.appendChild(col);
    });
  };

  buildAllMenuGrid();

  const toggleAllMenu = (open) => {
    if (!allMenu) return;

    allMenu.classList.toggle("is_open", open);
    allMenu.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.classList.toggle("all_menu_open", open);

    // 전체메뉴 열리면 헤더 블러는 유지하는 게 보통 UX 안정적
    syncHeaderBlur();
  };

  btnHam?.addEventListener("click", (e) => {
    e.preventDefault();
    toggleAllMenu(true);
  });

  btnCloseAll?.addEventListener("click", () => toggleAllMenu(false));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      toggleAllMenu(false);
      closeAllSubMenus();
      syncHeaderBlur();
    }
  });

  // ---- Header blur / hide on scroll ----
  function syncHeaderBlur() {
    const top = window.scrollY <= 10;
    const allOpen = allMenu?.classList.contains("is_open");
    const shouldBlur = !top || allOpen || isSubOpen;

    header.classList.toggle("is_header_blur", shouldBlur);

    // 맨 위면 숨김은 해제
    if (top) header.classList.remove("is_header_hidden");
  }

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    const top = y <= 10;

    // 블러는 상태 기준으로
    syncHeaderBlur();

    // 아래로 스크롤하면 숨김, 위로 스크롤하면 보임 (단, top이면 항상 보임)
    if (!top) {
      header.classList.toggle("is_header_hidden", y > lastScrollY);
    }

    lastScrollY = y;
  });

  const cardThumbs = $$(".best_card .bottom .card_thumb");
  const mainCardImg = $(".best_card .card01 img");
  const mainTags = $$(".best_card .txts .tag p");
  const mainTitle = $(".best_card .txts h3");
  const mainDesc = $(".best_card .txts .card_desc");
  const mainBenefit = $(".best_card .txts .card_benefit");
  const mainMore = $(".best_card .txts .more");
  const setMainCardFromThumb = (thumb) => {
    if (!mainCardImg || !thumb) return;
    const {
      src,
      alt,
      tag1,
      tag2,
      title,
      desc,
      benefit,
      link,
    } = thumb.dataset;

    if (src) mainCardImg.src = src;
    if (alt) mainCardImg.alt = alt;
    if (mainTags[0] && tag1) mainTags[0].textContent = tag1;
    if (mainTags[1] && tag2) mainTags[1].textContent = tag2;
    if (mainTitle && title) mainTitle.textContent = title;
    if (mainDesc && desc) mainDesc.textContent = desc;
    if (mainBenefit && benefit) mainBenefit.textContent = benefit;
    if (mainMore && link) mainMore.setAttribute("href", link);
  };

  if (cardThumbs.length) {
    cardThumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        cardThumbs.forEach((el) => {
          const isActive = el === thumb;
          el.classList.toggle("is_active", isActive);
          el.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
        setMainCardFromThumb(thumb);
      });
    });

    const initialActive = $(".best_card .bottom .card_thumb.is_active") || cardThumbs[0];
    if (initialActive) setMainCardFromThumb(initialActive);
  }
});

