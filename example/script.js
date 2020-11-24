// oxygen_animation is a global identifier
// if you use ES6 modules, you can also use it as:
// import * as oxygen_animation from "[path-to/dist/index.js]";
// import * as oxygen_animation from "../dist/index";

const init_form = document.querySelector("#init-form");

init_form.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();

    const stage = document.querySelector("#animation-stage");
    const necesar = +init_form.querySelector('input[name="necesar"]').value;

    oxygen_animation.init({
      element: stage,
      total_necesar: necesar,
    });
  },
  false
);

const animate_form = document.querySelector("#animate-form");

animate_form.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();

    const nume = animate_form.querySelector('input[name="nume"]').value;
    const suma = +animate_form.querySelector('input[name="suma"]').value;

    oxygen_animation.animateBubble({ nume, suma });
  },
  false
);
