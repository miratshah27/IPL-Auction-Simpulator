import { Button, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab } from '@mui/material';
import React, { Fragment, useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import CalculateIcon from '@mui/icons-material/Calculate';
import LogoutIcon from '@mui/icons-material/Logout';

function Navbar() {

  let navigate = useNavigate(); 
  
  const routeChange = (path) =>{ 
    setShowTeams(false);
    navigate('app'+path);
  }

  const [visible,setVisible] = useState(true);
  const [showTeams,setShowTeams] = useState(false);

  const teamButton = {borderRadius:'30px',margin:"2px"}
  const FabStyle = { margin: '5px 0px' }


  const [logoutConfirmation,setLogoutConfirmation] = useState(false);

  const handleLogout = () =>{
    window.location.href='/app/';
    localStorage.clear()
  }


  return (
    <div style={{ height: "100vh", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", position: "fixed",zIndex:"1" }}>
      {visible?<Fragment>
        <Fab color="primary" aria-label="add" style={FabStyle} onClick={()=>{routeChange('/dashboard')}}>
        <HomeIcon/>
      </Fab>
      <Fab color="primary" aria-label="add" style={FabStyle} onClick={()=>{routeChange('/search')}}>
        <SearchIcon />
      </Fab>
      <Fab color="primary" aria-label="add" style={FabStyle} onClick={()=>{routeChange('/leaderboard')}}>
        <LeaderboardIcon />
      </Fab>
      <Fab color="primary" aria-label="add" style={FabStyle} onClick={()=>setShowTeams(!showTeams)}>
        <FormatListBulletedIcon />
          <Collapse in={showTeams} style={{position:"absolute",transform:"translateX(70px)"}} >
          <Button variant='contained' color="success" onClick={()=>routeChange('/all-teams/RCB')} sx={teamButton}>RCB</Button>
          <Button variant='contained' color="success" onClick={()=>routeChange('/all-teams/MI')} sx={teamButton}>MI</Button>
          <Button variant='contained' color="success" onClick={()=>routeChange('/all-teams/CSK')} sx={teamButton}>CSK</Button>
          <Button variant='contained' color="success" onClick={()=>routeChange('/all-teams/KKR')} sx={teamButton}>KKR</Button>
          <Button variant='contained' color="success" onClick={()=>routeChange('/all-teams/RR')} sx={teamButton}>RR</Button>
          <Button variant='contained' color="success" onClick={()=>routeChange('/all-teams/DC')} sx={teamButton}>DC</Button>
          <Button variant='contained' color="success" onClick={()=>routeChange('/all-teams/SRH')} sx={teamButton}>SRH</Button>
          <Button variant='contained' color="success" onClick={()=>routeChange('/all-teams/PBKS')} sx={teamButton}>PBKS</Button>
          <Button variant='contained' color="success" onClick={()=>routeChange('/all-teams/GT')} sx={teamButton}>GT</Button>
          <Button variant='contained' color="success" onClick={()=>routeChange('/all-teams/LSG')} sx={teamButton}>LSG</Button>
        </Collapse>
        </Fab>
      <Fab color="primary" aria-label="add" style={FabStyle} onClick={()=>{routeChange('/calculator')}}>
        <CalculateIcon />
      </Fab>
      <Fab color="primary" aria-label="add" style={FabStyle} onClick={()=>{setLogoutConfirmation(true)}}>
        <LogoutIcon />
      </Fab>
      </Fragment>:null}
      <Fab color="primary" aria-label="add" style={FabStyle} onClick={()=>setVisible(!visible)}>
        {visible?<VisibilityOffIcon />:<VisibilityIcon/>}
      </Fab>
      <Dialog open={logoutConfirmation} onClose={()=>setLogoutConfirmation(false)}>
        <DialogTitle>
          {"Are you sure you want to logout?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={()=>setLogoutConfirmation(false)}>NO</Button>
          <Button onClick={handleLogout} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Navbar;
