# AI Feature and 👨‍🔬Research🧪

## 📜 Description of each Directory 
- 📂 `public` contains a static site that is hosted / served by the server, used for testing or showcasing the API.
- 📂 `src`
    - 📂 `logic` Contains the routes, each file in this folder is the logic for that route.
    - 📂 `infra` Each file in this folder contains code responsible for something in particular
    - 📂 `index.js` Contains the express server.

## 🏗️ Setup 
 1. Be on a linux machine that uses the `apt` package manager, and have the `poppler-utils` package installed
 2. Have `node` and `npm` installed (node version 18 to 22 preferrably)
 3. Have the following environment variables:
     - `DEEPSEEK_KEY` (deepseek API key)
     - `GOOGLE_APP` (google app key for sending mail)
 5. `git clone` this repo and `checkout research` to move to this branch
 4. Install npm dependencies with `npm update`

## 🏎️ Run 
1. Run with `npm start` or `node src/index.js`
2. Open static site in the browser at `localhost:3000/index.html` ⚠️**Must change `public/index.html` and `src/index.js` to point to localhost**
