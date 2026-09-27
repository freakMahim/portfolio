# Mahim — Personal Space

A cinematic, ocean/sky-inspired personal portfolio built with semantic HTML, CSS and vanilla JavaScript.

## Files

- `index.html` — page structure, SEO metadata, navigation, hero, social cards, footer and intro/music gate.
- `style.css` — all visual design, responsive layouts, glass UI, atmosphere and animations.
- `script.js` — intro gate, music controls, clipboard interaction, reveal animations and desktop tilt/magnetic interactions.
- `assets/ocean.gif` — supplied ocean/sky background.
- `assets/mahim.png` — supplied profile photo.
- `assets/music.mp3` — supplied background music.
- `assets/favicon.svg` — lightweight favicon.

## Customize

### Profile photo
Replace `assets/mahim.png` with your image and keep the same filename, or change the `src` of `#profileImage` in `index.html`.

### Music
Replace `assets/music.mp3` with another audio file, or change the `<audio id="bgMusic">` source in `index.html`.

### Background
Replace `assets/ocean.gif` with another background image/GIF, or change the `.atmosphere` and `.intro-backdrop` URLs in `style.css`.

### Social links
All social URLs are in the social-card anchors in `index.html`.

### Colors
Edit the CSS variables at the top of `style.css`, especially `--cyan`, `--blue`, `--bg`, `--panel` and `--line`.

### Text
Hero, intro, profile card, section and footer copy all live in `index.html`.

## Run

For the simplest local preview, use any static server from the project folder, for example:

`python -m http.server 8000`

Then open `http://localhost:8000`.

A static server is recommended because clipboard APIs and some browser behaviors are more reliable over HTTP/HTTPS than `file://`.
