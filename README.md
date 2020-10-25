# mindcops-revolution

"Gotta clean up the streets. At this point the entire planet is a city..."

# 🐝 bumblebee.floatingdown.stream

# Setup

Just run `npm install` and then `npm start`, then you will have the project running at http://localhost:8080

# Deploying

It lives on CloudFlare workers! You have to ask Kirt nicely to authorize you for deployment though.

Once authorized, if you run `npm run build:deploy`, it will create three files (`index.html`, `main.js` and `worker.js`) in the `dist` folder and then copy them straight over to bumblebee.floatingdown.stream!
