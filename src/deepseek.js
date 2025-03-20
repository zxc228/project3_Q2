const { OpenAI } = require("openai")

class DeepSeek {
    static MODELS = {CHAT: 'deepseek-chat', REASON: 'deepseek-reasoner'}

    constructor(apiKey) {
        this.ai = new OpenAI({ baseURL: 'https://api.deepseek.com', apiKey: apiKey })
    }

    completion = async (model, msg) => {
        return await this.ai.chat.completions.create({
            messages: [{ 
                role: model === DeepSeek.MODELS.CHAT ? 'system' : 'user', 
                content: msg 
            }], 
            model: model,
        })
    }
}

module.exports = { DeepSeek }

/*
(async () => {
    const ds = new DeepSeek(process.env.DEEPSEEK_PROJECT)
    const completion = await ds.completion(DeepSeek.MODELS.REASON, 'What do you recommend i do with my life if i have a software engineering degree, and are interested in python and node development')
    //console.log(completion)
    //console.log(completion.choices.length)
    //console.log(completion.choices[0].message)
    console.log(completion.choices[0].message.content)
    console.log(completion.choices[0].message.reasoning_content)
})()
*/

/*
async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "deepseek-chat",
  });

  console.log(completion.choices[0].message.content);
}
*/
