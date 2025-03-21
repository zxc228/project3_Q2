const { OpenAI } = require("openai")

class DeepSeek {
    constructor(model, apiKey) {
        this.ai = new OpenAI({ baseURL: 'https://api.deepseek.com', apiKey: apiKey })
        this.model = model 
    }

    completion = async (msg) => {
        return await this.ai.chat.completions.create({
            model: this.model,
            messages: [{ 
                role: this.model === DeepSeek.MODELS.CHAT ? 'system' : 'user',
                content: msg 
            }] 
        })
    }
}

const Models = { CHAT: 'deepseek-chat', REASON: 'deepseek-reasoner' }

module.exports = { DeepSeek , Models }

/*
(async () => {
    const ds = new DeepSeek(Models.CHAT, process.env.DEEPSEEK_PROJECT)
    const completion = await ds.completion('What do you recommend i do with my life if i have a software engineering degree, and are interested in python and node development')
    //console.log(completion)
    //console.log(completion.choices.length)
    //console.log(completion.choices[0].message)
    console.log(completion.choices[0].message.content)
    console.log(completion.choices[0].message.reasoning_content)
})()
*/

