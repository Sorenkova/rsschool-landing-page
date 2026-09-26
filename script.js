document.addEventListener("DOMContentLoaded", () => {
  // 1. Управление темой интерфейса (светлая / темная)
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

  // 2. Загрузка данных из products.json и динамическая генерация карточек
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

  // 3. Интерактивное переключение вкладок каталога
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
});
