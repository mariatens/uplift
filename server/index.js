const express = require('express');
var cors = require('cors');
const app = express();
app.use(express.json());
const port = 3001;
require('dotenv').config();

var whitelist = ['http://localhost:3000'];
var corsOptions = {
  origin: function (origin, callback) {
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  },
};

app.use(cors(corsOptions));

const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/ask', async (req, res) => {
  const prompt = req.body.prompt;
  try {
    if (prompt == null) {
      throw new Error('Uh oh, no prompt was provided');
    }

    // trigger OpenAI completion
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a therapist. I will send you a question, thought or feeling - please suggest helpful advice given my mental state.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 100,
    });

    console.log(response);

    const completion = response.data.choices[0].message.content;
    console.log(completion);
    return res.status(200).json({
      success: true,
      message: completion,
    });
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(port, () => console.log(`Server is running on port ${port}!!`));
