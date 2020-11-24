console.log("document loaded");

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
