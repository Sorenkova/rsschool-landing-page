const themeToggle = document.querySelector(".theme-toggle");
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem("theme") || "light";
htmlElement.setAttribute("data-theme", savedTheme);

themeToggle.addEventListener("click", () => {
  const currentTheme = htmlElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  htmlElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});

document.querySelectorAll(".menu-tab").forEach((button) => {
  button.addEventListener("click", () => {
    // 1. Убираем класс active у всех кнопок и разделов
    document
      .querySelectorAll(".menu-tab")
      .forEach((btn) => btn.classList.remove("active"));
    document
      .querySelectorAll(".menu-section")
      .forEach((section) => section.classList.remove("active"));

    // 2. Добавляем active на ту кнопку, на которую нажали
    button.classList.add("active");

    // 3. Находим нужный раздел по дата-атрибуту и делаем его видимым
    const tabId = button.getAttribute("data-tab");
    document.getElementById(tabId).classList.add("active");
  });
});
