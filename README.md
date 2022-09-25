TODO:

Hook in the assets from rabbit game project, rebuild initial scene

# lonely-city

# Assets

- One screen size is 256x192
- All images must be square (e.g. 256x256 or 512x512) for technical reasons. Any extra space for backgrounds should be at the bottom.

# Setup

Just run `npm install` and then `npm start`, then you will have the project running at http://localhost:8080

# Deploying

It lives on CloudFlare workers! You have to ask Kirt nicely to authorize you for deployment though.

Once authorized, if you run `npm run build:deploy`, it will create three files (`index.html`, `main.js` and `worker.js`) in the `dist` folder and then copy them straight over to bumblebee.floatingdown.stream!
