document.addEventListener("DOMContentLoaded", () => {
  // Управление темой интерфейса
  const themeToggle = document.querySelector(".theme-toggle");
  const htmlElement = document.documentElement;

  const applyTheme = (theme) => {
    if (theme === "dark") {
      htmlElement.setAttribute("data-theme", "dark");
    } else {
      htmlElement.setAttribute("data-theme", "light");
    }
  };

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    applyTheme("light");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = htmlElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }

  // Логика модального окна
  function openModal(product, categoryName, itemNumber) {
    const modalContainer = document.getElementById("product-modal");
    if (!modalContainer) return;

    const modalImg = document.getElementById("modal-img");
    const modalTitle = document.getElementById("modal-title");
    const modalDescr = document.getElementById("modal-descr");
    const modalPrice = document.getElementById("modal-price");
    const sizesContainer = document.getElementById("modal-sizes");
    const additivesContainer = document.getElementById("modal-additives");

    let basePrice = Number(product.price) || 0;
    let currentSizeAddPrice = 0;
    let additivesAddPrice = 0;

    const updateTotalPrice = () => {
      const total = basePrice + currentSizeAddPrice + additivesAddPrice;
      modalPrice.textContent = `$${total.toFixed(2)}`;
    };

    if (modalImg) {
      modalImg.src = `assets/img/${categoryName}${itemNumber}.png`;
      modalImg.alt = product.name;
    }
    if (modalTitle) modalTitle.textContent = product.name;
    if (modalDescr) modalDescr.textContent = product.description;

    if (sizesContainer && product.sizes) {
      sizesContainer.innerHTML = "";
      let isFirstSize = true;

      Object.entries(product.sizes).forEach(([key, sizeObj]) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.classList.add("modal__param-btn");
        if (isFirstSize) {
          btn.classList.add("active");
          currentSizeAddPrice = Number(sizeObj["add-price"]) || 0;
          isFirstSize = false;
        }

        btn.innerHTML = `<span>${key.toUpperCase()}</span> <span>${sizeObj.size}</span>`;

        btn.addEventListener("click", () => {
          sizesContainer
            .querySelectorAll(".modal__param-btn")
            .forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          currentSizeAddPrice = Number(sizeObj["add-price"]) || 0;
          updateTotalPrice();
        });

        sizesContainer.appendChild(btn);
      });
    }

    if (additivesContainer && product.additives) {
      additivesContainer.innerHTML = "";
      let activeAdditives = new Set();

      product.additives.forEach((additive, index) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.classList.add("modal__param-btn");

        btn.innerHTML = `<span>${index + 1}</span> <span>${additive.name}</span>`;

        btn.addEventListener("click", () => {
          btn.classList.toggle("active");
          const addPriceValue = Number(additive["add-price"]) || 0;

          if (activeAdditives.has(additive.name)) {
            activeAdditives.delete(additive.name);
            additivesAddPrice -= addPriceValue;
          } else {
            activeAdditives.add(additive.name);
            additivesAddPrice += addPriceValue;
          }
          updateTotalPrice();
        });

        additivesContainer.appendChild(btn);
      });
    }

    updateTotalPrice();

    modalContainer.classList.add("open");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const closeModal = () => {
      modalContainer.classList.remove("open");
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };

    const closeBtn = modalContainer.querySelector(".modal__close-btn");
    const closeActionBtn = document.getElementById("modal-close-btn");

    if (closeBtn) closeBtn.onclick = closeModal;
    if (closeActionBtn) closeActionBtn.onclick = closeModal;

    modalContainer.onclick = (event) => {
      if (event.target === modalContainer) closeModal();
    };

    const escapeHandler = (e) => {
      if (e.key === "Escape") {
        closeModal();
        document.removeEventListener("keydown", escapeHandler);
      }
    };
    document.addEventListener("keydown", escapeHandler);
  }

  // Загрузка данных и генерация карточек
  async function initMenu() {
    try {
      const response = await fetch("products.json");
      const products = await response.json();

      const renderCategoryCards = (categoryName, sectionId) => {
        const section = document.getElementById(sectionId);
        if (!section) return;

        let gridContainer = section.querySelector(".menu-grid");
        if (!gridContainer) {
          gridContainer = document.createElement("div");
          gridContainer.classList.add("menu-grid");
          section.appendChild(gridContainer);
        }

        gridContainer.innerHTML = "";

        const filtered = products.filter(
          (item) => item.category === categoryName,
        );

        filtered.forEach((product, index) => {
          const card = document.createElement("div");
          card.classList.add("menu-card");

          const numericPrice = Number(product.price) || 0;

          card.innerHTML = `
            <div class="menu-card__img-wrap">
              <img src="assets/img/${categoryName}${index + 1}.png" alt="${product.name}" class="menu-card__img" />
            </div>
            <div class="menu-card__content">
              <h2 class="menu-card__title">${product.name}</h2>
              <p class="menu-card__descr">${product.description}</p>
            </div>
            <div class="menu-card__price">$${numericPrice.toFixed(2)}</div>
          `;

          card.addEventListener("click", () => {
            openModal(product, categoryName, index + 1);
          });

          gridContainer.appendChild(card);
        });
      };

      renderCategoryCards("coffee", "coffee");
      renderCategoryCards("tea", "tea");
      renderCategoryCards("dessert", "dessert");
    } catch (error) {
      console.error("Ошибка при загрузке продуктов:", error);
    }
  }

  initMenu();

  // Переключение вкладок каталога
  const tabs = document.querySelectorAll(".menu-tab");
  const sections = document.querySelectorAll(".menu-section");

  if (tabs.length > 0 && sections.length > 0) {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        sections.forEach((s) => s.classList.remove("active"));

        tab.classList.add("active");

        const targetTab = tab.getAttribute("data-tab");
        const targetSection = document.getElementById(targetTab);
        if (targetSection) {
          targetSection.classList.add("active");
        }
      });
    });
  }

  // Управление бургер-меню
  const menuButton = document.querySelector(".menu-button");
  const body = document.body;
  const navLinks = document.querySelectorAll(".nav__link, .nav a");

  function toggleMenu() {
    const isOpen = body.classList.toggle("menu-open");

    if (menuButton) {
      menuButton.classList.toggle("is-open", isOpen);
      menuButton.classList.toggle("active", isOpen);
    }

    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
      body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      body.style.overflow = "";
    }
  }

  if (menuButton) {
    menuButton.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        toggleMenu();
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (body.classList.contains("menu-open")) {
        toggleMenu();
      }
    });
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && body.classList.contains("menu-open")) {
      toggleMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && body.classList.contains("menu-open")) {
      body.classList.remove("menu-open");
      if (menuButton) {
        menuButton.classList.remove("is-open", "active");
      }

      document.documentElement.style.overflow = "";
      body.style.overflow = "";
    }
  });

  // Управление слайдером
  const track = document.querySelector(".slider__track");
  const dots = document.querySelectorAll(".slider__dot");
  const prevBtn = document.querySelector(".slider__btn--prev");
  const nextBtn = document.querySelector(".slider__btn--next");

  if (track) {
    const realSlides = Array.from(track.children);
    const totalSlides = realSlides.length;

    const firstClone = realSlides[0].cloneNode(true);
    const lastClone = realSlides[totalSlides - 1].cloneNode(true);
    track.appendChild(firstClone);
    track.insertBefore(lastClone, realSlides[0]);

    let currentIndex = 1;
    let isAnimating = false;

    function setPosition(withTransition = true) {
      track.style.transition = withTransition
        ? "transform 0.4s ease-in-out"
        : "none";
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function updateDots() {
      let realIndex = currentIndex - 1;
      if (realIndex >= totalSlides) realIndex = 0;
      if (realIndex < 0) realIndex = totalSlides - 1;

      dots.forEach((dot, i) => {
        dot.classList.toggle("slider__dot--active", i === realIndex);
      });
    }

    function goTo(index) {
      if (isAnimating) return;
      isAnimating = true;
      currentIndex = index;
      setPosition(true);
      updateDots();
    }

    track.addEventListener("transitionend", () => {
      isAnimating = false;
      if (currentIndex === totalSlides + 1) {
        currentIndex = 1;
        setPosition(false);
      } else if (currentIndex === 0) {
        currentIndex = totalSlides;
        setPosition(false);
      }
      updateDots();
    });

    setPosition(false);
    updateDots();

    if (nextBtn)
      nextBtn.addEventListener("click", () => goTo(currentIndex + 1));
    if (prevBtn)
      prevBtn.addEventListener("click", () => goTo(currentIndex - 1));

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => goTo(i + 1));
    });

    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true },
    );

    track.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      },
      { passive: true },
    );

    function handleSwipe() {
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) {
        goTo(currentIndex + 1);
      }
      if (touchEndX > touchStartX + swipeThreshold) {
        goTo(currentIndex - 1);
      }
    }
  }
});
