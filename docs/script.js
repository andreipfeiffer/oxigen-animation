// oxygen_animation is a global identifier
// if you use ES6 modules, you can also use it as:
import * as oxygen_animation from "./index";

function init() {
  const stage = document.querySelector("#animation-stage");
  const necesar = +init_form.querySelector('input[name="necesar"]').value;

  oxygen_animation.init({
    element: stage,
    total_necesar: necesar,
  });
}

function update() {
  const suma = +update_form.querySelector('input[name="suma"]').value;
  const donatori = +update_form.querySelector('input[name="donatori"]').value;

  oxygen_animation.update({
    donatori,
    total_strans: suma,
  });
}

function animate() {
  const nume = animate_form.querySelector('input[name="nume"]').value;
  const suma = +animate_form.querySelector('input[name="suma"]').value;

  oxygen_animation.animate({ nume, suma });
}

const init_form = document.querySelector("#init-form");

window.addEventListener("resize", init);
init_form.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();
    init();
  },
  false
);

const update_form = document.querySelector("#update-form");

update_form.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();
    update();
  },
  false
);

const animate_form = document.querySelector("#animate-form");

animate_form.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();
    animate();
  },
  false
);
