import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import { useState } from 'react';
import image from './uplift.png';
import axios from 'axios';
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

  const { transcript, browserSupportsSpeechRecognition, listening } =
    useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser doesn't support Speech to Text</span>;
  }
  const handleSubmit = () => {
    axios
      .post('http://localhost:3001/ask', {
        prompt: transcript,
      })
      .then((response) => {
        setApiResponse(response.message);
      });
  };

  return (
    <main className="landing-page">
      <h1>{selectedPrompt}</h1>
      <div>
        <button
          className="microphone"
          // onClick={()=>()}
        >
          <FontAwesomeIcon
            size="3x"
            icon={faVolumeUp}
            color={listening ? 'red' : undefined}
          />
        </button>
      </div>
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
