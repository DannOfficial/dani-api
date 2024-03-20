const header = document.querySelector("header");
const menuToggler = document.querySelectorAll("#menu_toggle");

menuToggler.forEach(toggler => {
  toggler.addEventListener("click", () => header.classList.toggle("showMenu"));
});