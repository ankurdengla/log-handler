import './App.css';
import InputBar from './components/InputBar';
import LogsList from './components/LogsList';

function App() {
  return (
    <div className="log-handler">
      <InputBar />
      <LogsList />
    </div>
  );
}

export default App;
