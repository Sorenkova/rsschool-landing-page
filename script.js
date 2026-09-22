document.addEventListener("DOMContentLoaded", () => {
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
