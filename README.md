# 🧠AI✨ Feature 🍌🙉 ... and 👨‍🔬Research🧪

## Description of each Directory:
- `notes` contains the **rokes-skills jsons**, and some brainstorming
- `public` contains a static site that is hosted / served by the server
- `src`
    - Every file inside `src` contains an `Example` section (a commented block of code at the end of the file)
    - Some of the examples use paths to **files that are not included, (you must change the path)**
    - **Short description of every file:**
        - `lima.js` Contains class for fetching data from the local ollama server.
        - `qexecutor.js` Contains class that executes tasks in a queue (See example at the bottom of the file)
        - `textract.js` Extract text from files
        - `mail.js` Send emails ... **Replace the email and password with your own**. Also, must use **gmail** and [**Google App Password**](https://myaccount.google.com/apppasswords?pli=1&rapt=AEjHL4OXXKazkNei9K3IXoyWP0j7RrXfYRN6ynWifgijP32H0ImSIBfuO1tspi39NWe-AkyckGEFgXOmg5Ib2xX1ZspJusFz20bl6EvJy_430U64V_09QfI)
        - `server.js` Contains the express server, **which also hosts the static website in the `public` directory** 
        - `constants.js` Just contants stored there for organization and readability
        - `jwt.js` **[Unused]** Just some code on how to use JSON Web Tokens

## Setup
 1. Install Ollama
     - On **UNIX**: `curl -fsSL https://ollama.com/install.sh | sh`
     - On **Mac**, download from [Ollama](https://ollama.com/download/mac)
     - On Win**BLOWS**, download [Ollama](https://ollama.com/download/windows)
 2. Install at least 2 models: `ollama pull deepseek-r1:1.5b llama3.2`
 3. Make sure ollama server is running (runs by default??) and on port `11434` (default). You can check with `systemctl status ollama` on linux. If ollama server isn't running (weird), run `ollama serve`
 4. Install npm dependencies with `npm update`

## Run
Run with `npm start` or `node src/server.js`



