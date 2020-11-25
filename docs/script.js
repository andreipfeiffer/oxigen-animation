// oxygen_animation is a global identifier
// if you use ES6 modules, you can also use it as:
// import * as oxygen_animation from "./index";

const stage = document.querySelector("#animation-stage");

const init_form = document.querySelector("#init-form");
const update_form = document.querySelector("#update-form");
const animate_form = document.querySelector("#animate-form");

const necesar = init_form.querySelector('input[name="necesar"]');
const strans = update_form.querySelector('input[name="strans"]');
const donatori = update_form.querySelector('input[name="donatori"]');
const nume = animate_form.querySelector('input[name="nume"]');
const suma = animate_form.querySelector('input[name="suma"]');

function init() {
  oxygen_animation.init({
    element: stage,
    total_necesar: +necesar.value,
  });
}

function update() {
  oxygen_animation.update({
    donatori: +donatori.value,
    total_strans: +strans.value,
  });
}

function animate() {
  oxygen_animation.animate({
    nume: nume.value,
    suma: +suma.value,
  });
}

init();
update();

necesar.addEventListener("keyup", init, false);
strans.addEventListener("keyup", update, false);
donatori.addEventListener("keyup", update, false);
nume.addEventListener("keyup", animate, false);
suma.addEventListener("keyup", animate, false);

animate_form.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();
    animate();
  },
  false
);
