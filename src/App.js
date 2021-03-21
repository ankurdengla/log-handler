import './App.css';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="log-handler">
        <Sidebar />
        <MainContent />
      </div>
    </ThemeProvider>
    
  );
}

export default App;
