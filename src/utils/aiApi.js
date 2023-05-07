//In ai.js
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPEN_API_KEY,
});
const openai = new OpenAIApi(configuration);
async function ask(prompt) {
  const response = await openai.createCompletion({
    prompt,
    model: "text-davinci-003",
    max_tokens: 2500,
    temperature: 0.3,
    top_p: 0.3,
    presence_penalty: 0,
    frequency_penalty: 0.5,
  });
  return response.data.choices[0].text;
}

module.exports = {ask};
