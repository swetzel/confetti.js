# [🎉 confetti.js](https://confettijs.org/)

***A lightweight confetti browser animation library.***

[![jsdelivr][jsdelivr.svg]][jsdelivr.link]
[![npm-downloads][npm-downloads.svg]][npm.link]
[![npm-version][npm-version.svg]][npm.link]

[jsdelivr.svg]: https://data.jsdelivr.com/v1/package/npm/@hiseb/confetti/badge?style=rounded
[jsdelivr.link]: https://www.jsdelivr.com/package/npm/@hiseb/confetti
[npm-downloads.svg]: https://img.shields.io/npm/dm/@hiseb/confetti.svg
[npm.link]: https://www.npmjs.com/package/@hiseb/confetti
[npm-version.svg]: https://img.shields.io/npm/v/@hiseb/confetti.svg

![confetti](/assets/confetti.gif)

## Install

You can install this library from NPM:

```bash
npm install --save @hiseb/confetti
```

Alternatively, you can include this library in your HTML page directly from a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@hiseb/confetti@2.0.7/dist/confetti.min.js"></script>
```

## Usage

```js
import confetti from "@hiseb/confetti";
confetti();
```

```html
<script src="https://cdn.jsdelivr.net/npm/@hiseb/confetti@2.0.7/dist/confetti.min.js"></script>
<script>
    confetti();
</script>
```

## API

The confetti function takes in a config object, all parameters are optional:

```js
confetti({
    position: { x: 0, y: 0 },   // Origin position
    count: 100,                 // Number of particles
    size: 1,                    // Size of the particles
    velocity: 200,              // Initial particle velocity
    fade: false,                // Particles fall off the screen, or fade out
});
```

## Examples

```js
window.addEventListener("click", (event) => {
    confetti({ position: { x: event.clientX, y: event.clientY } });
});
```