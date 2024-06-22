import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css';
import Navbar from './Components/Navbar';
import Redirector from './Components/Redirector';
import AllTeams from './Pages/AllTeams';
import Calculator from './Pages/Calculator';
import Dashboard from './Pages/Dashboard';
import LandingPage from './Pages/LandingPage';
import Leaderboard from './Pages/Leaderboard';
import Search from './Pages/Search';


const theme = createTheme({
  palette: {
    success: {
      main: "#66ff66",
    }
  },
  typography: {
    allVariants: {
      color: "#1976d2",
      fontFamily: "bahnschrift",
      fontWeight: "bold"
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App" style={{ display: 'flex', flexDirection: "row" }}>
          {!localStorage.getItem('token') ? null : <Navbar />}
          <Routes>
            {localStorage.getItem('token') ?
              <Fragment>
                <Route exact path='/app/' element={<LandingPage />} />
                <Route exact path='/app/dashboard' element={<Dashboard />} />
                <Route exact path='/app/all-teams/:name' element={<AllTeams />} />
                <Route exact path='/app/search' element={<Search />} />
                <Route exact path='/app/leaderboard' element={<Leaderboard />} />
                <Route exact path='/app/redirector' element={<Redirector />} />
                <Route exact path='/app/calculator' element={<Calculator />} />
              </Fragment>
              : <Route path='/app/*' element={<LandingPage/>} />}
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App;
