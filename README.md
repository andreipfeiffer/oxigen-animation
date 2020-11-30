# oxigen-animation

Animation for the Oxigen Website.

<br />

## Setup

```
npm install git+https://github.com/andreipfeiffer/oxigen-animation.git
```

or simply [download](https://raw.githubusercontent.com/andreipfeiffer/oxigen-animation/main/docs/index.js) it.

<br />

## Usage

```js
import * as oxigen_animation from "oxygen-animation";
```

### .init()

Should be called when you want to initialize the package:

```js
oxigen_animation.init({
  // the container for the animation
  element: document.querySelector("#animation-scene"),
  total_necesar: 250000000,
});
```

### .update()

```js
oxigen_animation.update({
  total_strans: 1100000,
  donatori: 146,
});
```

### .animate()

```js
// you can pass an object:
oxigen_animation.animate({
  nume: "Andrei P.",
  suma: 200,
});

// or an Array
oxigen_animation.animate([
  { nume: "Andrei", suma: 100 },
  { nume: "Pfeiffer", suma: 200 },
  // ...
]);
```

### .stop()

```js
// stops the loop animation
oxigen_animation.stop();
```

<br />

## Development

```
// start build system (TS compiler) in watch mode
npm run watch
```

Open **`/docs/index.html`** in your browser, preferably with a Live Server.
