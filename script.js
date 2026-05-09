// script.js

window.addEventListener("scroll", () => {

  const navbar = document.querySelector(".navbar");

  if(window.scrollY > 50){

    navbar.style.background = "rgba(255,255,255,0.95)";

  } else {

    navbar.style.background = "rgba(255,255,255,0.75)";

  }

});
