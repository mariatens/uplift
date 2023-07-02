import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import { useState } from 'react';
import image from './uplift.png';
const { Configuration, OpenAIApi } = require('openai');
function App() {
  const [apiResponse, setApiResponse] = useState('');
  const prompts = [
    "What's on your mind?",
    'What surprised you today?',
    'What is your intention for tomorrow?',
  ];
  // Generate a secure random number
  const randomArray = new Uint32Array(1);
  window.crypto.getRandomValues(randomArray);
  const randomIndex = randomArray[0] % prompts.length;
  const selectedPrompt = prompts[randomIndex];

  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const { transcript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser doesn't support Speech to Text</span>;
  }

  const handleSubmit = async () => {
    try {
      const result = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `You are a therapist, help with this issue: ${transcript}`,
          },
        ],
      });
      setApiResponse(result.data.choices[0].text);
    } catch (error) {
      setApiResponse('Something is going wrong, Please try again.');
    }
  };

  return (
    <main className="landing-page">
      <h1>{selectedPrompt}</h1>
      <button className="microphone" onClick={SpeechRecognition.startListening}>
        <FontAwesomeIcon size="8x" icon={faMicrophone} />
      </button>
      <div style={{ padding: '10px' }}>
        <button className="submit-btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>
      <p>{transcript}</p>
      {apiResponse && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <strong>Therapist response: </strong>
          {apiResponse}
        </div>
      )}
      <img width="300px" height="300px" alt="logo" src={image}></img>
    </main>
  );
}

export default App;
