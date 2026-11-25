# Victor Kipkemboi: portfolio

Live site: https://vick45-dot.github.io/My-Portfolio/

A one-page portfolio where the map of Kenya is the navigation. Scroll and the map moves from Kenya to Nakuru and Suwerwa, where my projects are, then back out to the DreamPath routes. Every project opens in a full-screen viewer. Press Ctrl+K (or `/`) to jump anywhere.

It is plain HTML, CSS and JavaScript. There is no build step and no framework.

## Run it

Open `index.html`, or serve the folder:

```
python -m http.server 4300
```

## Update it

- Projects, wording and links: `js/data.js`. Each project is one entry in `VK.PROJECTS`.
- Colours and layout: `css/site.css`.
- The map story: `js/story.js`. The camera stops are in `VK.CAMERA` in `js/data.js`.

Pushing to `main` publishes the site through GitHub Pages.

## Credits

- Kenya outline and neighbouring borders: Natural Earth (public domain), simplified.
- Fonts: Familjen Grotesk and Source Serif 4, both SIL Open Font License. Licences are in `fonts/`.
- The pin for Suwerwa is approximate.
- The two DreamPath screens are captured from the running app and show no third-party photographs.

The `projects/` folder holds the three demo sites that are shown inside the viewer.
