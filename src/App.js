import './App.css';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const sidebarTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#00ddd6'
    }
  },
});


function App() {
  return (
    <div className="log-handler">
      <CssBaseline />
      <ThemeProvider theme={sidebarTheme}>
        <Sidebar />
      </ThemeProvider>
      <MainContent />
    </div>
  );
}

export default App;
