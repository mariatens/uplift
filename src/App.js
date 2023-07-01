import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function App() {
  const { transcript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser doesn't support Speech to Text</span>;
  }

  return (
    <main className="landing-page">
      <h1>What's on your mind?</h1>
      <button className="microphone" onClick={SpeechRecognition.startListening}>
        <FontAwesomeIcon size="xl" icon={faMicrophone} />
      </button>
      <p>{transcript}</p>
    </main>
  );
}

export default App;
