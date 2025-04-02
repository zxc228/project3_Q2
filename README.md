# 🧠AI✨ Feature 🍌🙉 and 👨‍🔬Research🧪

## Description of each Directory 📜
- `notes` contains the **rokes-skills jsons**, and some brainstorming
- `public` contains a static site that is hosted / served by the server
- `src`
    - **Short description of every file:**
        - `constants.js` Contains regex, prompts and other constant-ish things
        - `utils.js` Contains the classes to conveniently call Deepseek API, extract text from files and send emails
        - `post_request.js` Encapsulates the logic to handle the single POST request of this server 
        - `index.js` Contains the express server.

## Setup 🏗️
 1. Be on a linux machine that uses the `apt` package manager, and have the `poppler-utils` package installed
 2. Have `node` and `npm` installed (node version 18 to 22 preferrably)
 3. Have a `DEEPSEEK_KEY` and `GOOGLE_APP` environment variables (deepseek API key and Google App key for sending mail). If you are using a different email account, youll have to edit the `Mail` class inside `utils.js` file
 4. `git clone` this repo and `checkout research` to move to this branch
 4. Install npm dependencies with `npm update`

## Run 🏎️
1. Run with `npm start` or `node src/server.js`
2. Open static site in the browser at `localhost:3000/index.html`

