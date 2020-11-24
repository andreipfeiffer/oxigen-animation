// oxygen_animation is a global identifier
// if you use ES6 modules, you can also use it as:
// import * as oxygen_animation from "[path-to/dist/index.js]";
// import * as oxygen_animation from "../dist/index";

function init() {
  const stage = document.querySelector("#animation-stage");
  const necesar = +init_form.querySelector('input[name="necesar"]').value;

  oxygen_animation.init({
    element: stage,
    total_necesar: necesar,
  });
}

function animate() {
  const nume = animate_form.querySelector('input[name="nume"]').value;
  const suma = +animate_form.querySelector('input[name="suma"]').value;

  oxygen_animation.animateBubble({ nume, suma });
}

const init_form = document.querySelector("#init-form");

init_form.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();
    init();
  },
  false
);

window.addEventListener("resize", init);

const animate_form = document.querySelector("#animate-form");

animate_form.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();
    animate();
  },
  false
);
