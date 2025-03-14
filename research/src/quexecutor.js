// TODO: add destructor function optionally, (like, to remove files from the uploads directory)
class QuExecutor {
    constructor(jobFunction) {
        this.queue = [] 
        this.processing = false 
        this.jobFunction = jobFunction
    }

    handle = async (prompt) => {
        return new Promise((resolve, reject) => {
            this.queue.push({ prompt, resolve, reject })
            if (!this.processing) this.processQueue();
        })
    }

    processQueue = async () => {
        if (this.queue.length === 0) {
            this.processing = false; 
            return;
        }

        this.processing = true; 
        const { prompt, resolve, reject } = this.queue.shift(); 

        this.jobFunction(prompt).then(resolve).catch(reject).finally(() => this.processQueue())
    }
};

module.exports = { QuExecutor }

// QUEXECUTOR EXAMPLE USAGE
/*
(async () => {
    const { Lima } = require('./lima')
    Lima.model = await Lima.getModels().then(r => r[1].model)
    const job = async (prompt) => { return await Lima.chat(prompt) }
    let handler = new QuExecutor(job)

    await handler.handle("hi").then(console.log).catch(console.error)
    await handler.handle("what is an LLM?").then(console.log).catch(console.error)
    await handler.handle("Please help me").then(console.log).catch(console.error)
    await handler.handle("waht is 2+2?").then(console.log).catch(console.error)
    await handler.handle("help me").then(console.log).catch(console.error)
    await handler.handle("help me help you").then(console.log).catch(console.error)
    await handler.handle("tell me a joke").then(console.log).catch(console.error)
    await handler.handle("wite a story about a storyteller").then(console.log).catch(console.error)
    await handler.handle("wuoaaahhh").then(console.log).catch(console.error)
    await handler.handle("im the skatman skibididi dididi").then(console.log).catch(console.error)
    await handler.handle("what is El Quijote about?").then(console.log).catch(console.error)
    await handler.handle("sexual healing, dududu, im healing, by Marvin GAYE").then(console.log).catch(console.error)
    await handler.handle("huhuhuhu stayin alive stayin alive").then(console.log).catch(console.error)
    await handler.handle("coconut wotah, is gud fo yo dautah, taste sweet like candey, makes ya feel vey dandey").then(console.log).catch(console.error)
    await handler.handle("what is a pointurr?").then(console.log).catch(console.error)
    await handler.handle("gibe me shugah bb").then(console.log).catch(console.error)
})()
*/
