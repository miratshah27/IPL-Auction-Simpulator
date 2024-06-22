import PlayerCard from '../Components/PlayerCard';
import React, { useEffect, useState } from 'react';
import { Collapse, Grid, IconButton, Paper, Typography } from '@mui/material'
import axiosInstance, { mediaUrl } from '../AxiosInstance.jsx'
import BoltIcon from '@mui/icons-material/Bolt';
import Box from '@mui/material/Box';
import { useParams } from 'react-router';

const chip = { width: "150px", borderRadius: "50px", padding: '20px', alignItems: "center", justifyContent: "space-around" }
const chipTitle = { borderRadius: "30px", padding: "10px", textAlign: "center", fontWeight: "bolder", margin: "auto", color: "#13b413", boxShadow: "1px 1px 5px" }
const chipContent = { fontSize: "large", color: "rgb(71 178 71)", fontWeight: "bold", marginRight: '10px', marginTop: "10px", textAlign: 'center' }
const titleStyle = { width: "100%", height: "50px", lineHeight: "50px", borderRadius: "30px", background: "wheat", color: 'black', textAlign: "center", alignSelf: 'center', marginBottom: "20px", background: "linear-gradient(45deg, black, #9caeec,black)" }
const stat2 = { width: "90%", height: "50px", background: "#3d0080", borderRadius: '30px', padding: "10px" };
const statTitle = { margin: "auto", textAlign: "center", color: "white" }
const statSeparator = { border: '1px solid white', background: "white", borderRadius: '20px' }
const statValue = { color: "white", textAlign: "center" }
const statsHeading = { color: "black", margin: "10px 0px 10px 10px", fontSize: "large" }
const statsBackground = { width: "100%", height: "100px", background: "white", borderRadius: "30px", margin: "30px 0px 50px 0px", padding: "10px" }


function AllTeams() {

  const teamName = useParams();

  const [info, setTeamInfo] = useState()
  const [players, setPlayerData] = useState([])
  const [powercards, setPowercards] = useState()
  const [open, setOpen] = useState(false)
  const [stats, setStats] = useState([])

  useEffect(() => {
    axiosInstance.get(`all-team-data/${teamName.name}`).then(res => {
      setTeamInfo(res.data[0])
    })

    axiosInstance.get(`all-player-data/${teamName.name}`).then((res) => {
      setPlayerData(res.data)
    })

    axiosInstance.get(`powercard/${teamName.name}`).then((res) => {
      setPowercards(res.data)
    })

    axiosInstance.get(`all-team-stats/${teamName.name}`).then((res) => {
      setStats(res.data)
      console.log(res.data)
    })
  }, [teamName])

  return (
    <div style={{ width: "100%", color: "white", padding: "20px" }}>
      <div style={titleStyle}>{teamName.name}</div>
      <Grid container style={{ marginBottom: "20px" }}>
        <Grid item sx={{ ...chip, background: "radial-gradient(white, #75ed75)", marginRight: "10px" }} >
          <Typography sx={{ ...chipTitle, background: "linear-gradient(-90deg, #66ff66, #dfdfdff2)" }}>Budget</Typography>
          <Typography style={{ ...chipContent }}>₹{info ? info['budget'] : null}CR</Typography>
        </Grid>
        <Grid item sx={{ ...chip, background: "radial-gradient(white, #e8ab3c)", marginRight: "10px" }} >
          <Typography sx={{ ...chipTitle, background: "linear-gradient(-90deg, #e8ab3c, #dfdfdff2)", color: "#866300" }}>Score</Typography>
          <Typography style={{ ...chipContent, color: "#866300" }}>{info ? info['score'] : null}</Typography>
        </Grid>
        <Grid item sx={{ ...chip, background: "black", margin: (window.screen.width < 600 ? '10px 5px' : '0px 5px'), border: "1px groove white", textAlign: 'center', padding: "1px", display: "flex" }} >
          {info ? <img src={require(`../Images/${info['name']}.png`)} style={{ height: "100px" }} /> : null}
        </Grid>
        <Grid item sx={{ ...chip, background: "white", marginRight: "10px", margin: (window.screen.width < 600 ? '10px 0px' : "0px 5px"), justifyContent: "center", display: "flex" }} >
          <div style={{ alignSelf: "center", width: '80px', borderRadius: "30px", textAlign: 'center',zIndex:"1"}} onClick={() => setOpen(!open)}>
            <BoltIcon fontSize='large' style={{ color: 'black' }} />
            <Box style={{ display: 'flex' }}>
              <Collapse in={open} sx={{ borderRadius: "25px 25px 50px 50px", padding: "25px", textAlign: "center", width: "110px", height: "300px", background: "wheat", position: "absolute", transform: "translate(-39px, 50px)" }}>
                {powercards ? powercards.map((powercard, key) => (
                  <img key={key} style={{
                    borderRadius: '20px', marginBottom: "5px", width: "auto", height: "60px", width: "95px"
                  }}
                    src={mediaUrl + powercard['image']} />
                )) : null}
              </Collapse>
            </Box>
          </div>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ ...statsBackground, background: "radial-gradient(white, #9c42ff)" }}>
        <Typography sx={statsHeading}>Playing : {stats.total}/11 </Typography>
        {stats ? <div style={{ display: "flex", justifyContent: "space-around" }}>
          <Paper elevation={6} sx={stat2}>
            <Typography sx={statTitle}>Bat</Typography>
            <div style={statSeparator} />
            <Typography sx={statValue}>{stats.bat}/5</Typography>
          </Paper>
          <Paper elevation={6} sx={stat2}>
            <Typography sx={statTitle}>Bow</Typography>
            <div style={statSeparator} />
            <Typography sx={statValue}>{stats.bowl}/5</Typography>
          </Paper>
          <Paper elevation={6} sx={stat2}>
            <Typography sx={statTitle}>All</Typography>
            <div style={statSeparator} />
            <Typography sx={statValue}>{stats.all}/3</Typography>
          </Paper>
          <Paper elevation={6} sx={stat2}>
            <Typography sx={statTitle}>Wk</Typography>
            <div style={statSeparator} />
            <Typography sx={statValue}>{stats.wk}/2</Typography>
          </Paper>
          <Paper elevation={6} sx={stat2}>
            <Typography sx={statTitle}>For</Typography>
            <div style={statSeparator} />
            <Typography sx={statValue}>{stats.foreign}/4</Typography>
          </Paper>
          <Paper elevation={6} sx={stat2}>
            <Typography sx={statTitle}>Hid</Typography>
            <div style={statSeparator} />
            <Typography sx={statValue}>{stats.legCount}/2</Typography>
          </Paper>
          <Paper elevation={6} sx={stat2}>
            <Typography sx={statTitle}>Un</Typography>
            <div style={statSeparator} />
            <Typography sx={statValue}>{stats.uncappedCount}</Typography>
          </Paper>
        </div> : null}
      </Grid>
      <Grid item xs={12} style={{ width: "100%", display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        {players.map((player, key) => (
          <PlayerCard key={key} image={player.image} color={player.color} name={player.name} overall={player.overall} bat_ppl={player.bat_ppl} bat_mid={player.bat_mid} bat_death={player.bat_death} bow_ppl={player.bow_ppl} bow_death={player.bow_death} bow_mid={player.bow_mid} type={player.type}
            foreign={player.foreign} is_starred={player.is_starred} is_wk={player.is_wk} is_uncapped={player.is_uncapped} price={player.price} id={player.id} playing11={player.playing11} type={player.type} price='0' retainedBy={player.retainedBy} style={{ height: "220px" }} />
        ))}
      </Grid>
    </div >
  )
}

export default AllTeams;
