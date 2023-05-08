//In ai.js

const nebi = require('./../config/NebiAI.json')

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPEN_API_KEY,
});
const openai = new OpenAIApi(configuration);
async function ask(prompt) {

  

  const response = await openai.createCompletion({
    prompt: nebi.OAI_data[0].prompt + "\n\n#########\n" + prompt + "\n#########\n",
    model: nebi.OAI_data[0].model,
    max_tokens: nebi.OAI_data[0].max_tokens,
    temperature: nebi.OAI_data[0].temperature,
    top_p: nebi.OAI_data[0].top_p,
    presence_penalty: nebi.OAI_data[0].presence_penalty,
    frequency_penalty: nebi.OAI_data[0].frequency_penalty
  });
  return response.data.choices[0].text;
}

module.exports = {ask};
