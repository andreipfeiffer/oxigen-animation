// oxygen_animation is a global identifier
// if you use ES6 modules, you can also use it as:
// import * as oxygen_animation from "[path-to/dist/index.js]";
// import * as oxygen_animation from "../dist/index";

const stage = document.querySelector("#animation-stage");

oxygen_animation.init({
  element: stage,
  total_necesar: 250000000,
  total_strans: 800000,
  donatori: 125,
});

const form = document.querySelector("#animate-form");

form.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();

    const nume = form.querySelector('input[name="nume"]').value;
    const suma = +form.querySelector('input[name="suma"]').value;

    oxygen_animation.animateBubble({ nume, suma });
  },
  false
);
