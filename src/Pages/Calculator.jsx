import { Button, ButtonGroup, Collapse, IconButton, Grid } from '@mui/material';
import React, { useState, useEffect } from 'react';
import CalculateIcon from '@mui/icons-material/Calculate';
import PlayerCard from '../Components/PlayerCard.jsx'
import DoneIcon from '@mui/icons-material/Done';
import { useNavigate } from 'react-router';
import axiosInstance from '../AxiosInstance.jsx';
import {GiCricketBat} from 'react-icons/gi'
import {FaBaseballBall} from 'react-icons/fa'


const containerBackground = { margin: "20px auto", width: "96.5%", background: "wheat", padding: "10px", borderRadius: "30px" }
const containerTitle = { margin: '10px', padding: "10px", fontSize: 'large' }
const containerBody = { width: "100%", background: "red", borderRadius: "20px", padding: "10px 0px",display:"flex",flexWrap:"wrap"}
const IconButtonStyle = { background: "linear-gradient(45deg,white,wheat)", borderRadius: "10px" }
const calculateButton = { width: "100%", height: "50px", lineHeight: "50px", borderRadius: "30px", background: "wheat", color: 'black', textAlign: "center", alignSelf: 'center', marginBottom: "20px", background: "linear-gradient(45deg, black, #9caeec,black)" }

function Calculator() {

    const [open, setOpen] = useState(true);

    const [score, setScore] = useState(0)
    const navigate = useNavigate()

    const [batsman, set_batsman] = useState();
    const [bowler, set_bowler] = useState();
    const [baseScore, setBaseScore] = useState();
    const [split, setSplit] = useState({
        BAT: {
            PPL: [],//4
            MO: [],//4
            DEATH: [],//2
        },
        BOWL: {
            PPL: [],//4
            MO: [],//4
            DEATH: [],//2
        }
    })

    const handleRemoveplayer = (type, category, player) => {
        split[type][category].map(player => {
            if (type === "BAT") {
                batsman.map(item => {
                    if (item.name === player.name) {
                        item[category] = false
                        item['count']--
                    }
                })
            }
            else if (type === "BOWL") {
                bowler.map(item => {
                    if (item.name === player.name) {
                        item[category] = false
                        item['count']--
                    }
                })
            }
        })
        let newSplit = { ...split }
        newSplit[type][category] = []
        setSplit(newSplit)
    }

    const handleAddPlayer = (type, category, player) => {
        let newSplit = { ...split }
        newSplit[type][category].push(player)
        if (type === "BAT") {
            batsman.map(item => {
                if (item.name === player.name) {
                    item[category] = true
                    item['count']++
                }
            })
        }
        else if (type === "BOWL") {
            bowler.map(item => {
                if (item.name === player.name) {
                    item[category] = true
                    item['count']++
                }
            })
        }
        console.log(batsman)
        setSplit(newSplit)
    }

    const calculateScore = () => {
        console.log(split)
        let temp = 0
        let score = 0
        split['BAT']['PPL'].map(player => {
            temp += player.bat_ppl
        })
        if (temp > 36) score += 5
        else if (temp > 32) score += 3
        else if (temp >= 28) score += 1
        temp = 0;

        split['BAT']['MO'].map(player => {
            temp += player.bat_mid
        })
        if (temp > 36) score += 5
        else if (temp > 32) score += 3
        else if (temp >= 28) score += 1
        temp = 0;

        split['BAT']['DEATH'].map(player => {
            temp += player.bat_death
        })
        if (temp > 18) score += 5
        else if (temp > 16) score += 3
        else if (temp >= 14) score += 1
        temp = 0;

        split['BOWL']['PPL'].map(player => {
            temp += player.bow_ppl
        })
        if (temp > 27) score += 5
        else if (temp > 24) score += 3
        else if (temp >= 21) score += 1
        temp = 0;
        split['BOWL']['MO'].map(player => {
            temp += player.bow_mid
        })
        if (temp > 27) score += 5
        else if (temp > 24) score += 3
        else if (temp >= 21) score += 1
        temp = 0;
        split['BOWL']['DEATH'].map(player => {
            temp += player.bow_death
        })
        if (temp > 18) score += 5
        else if (temp > 16) score += 3
        else if (temp >= 14) score += 1
        temp = 0;

        setScore(baseScore + score)
    }

    const saveScore = () => {
        axiosInstance.post('calculator/save-score', { score: score }).then(res => {
            if (res.data === "Success") {
                sessionStorage.setItem("split",JSON.stringify(split))
            }
        })
    }

    useEffect(() => {
        axiosInstance.get('calculator/batsman').then(res => {
            set_batsman(res.data)
        })

        axiosInstance.get('calculator/bowler').then(res => {
            set_bowler(res.data)
        })

        axiosInstance.get('team/statistics').then(res => setBaseScore(res.data['score']))

        if(sessionStorage.getItem('split')){
            setSplit(JSON.parse(sessionStorage.getItem('split')))
        }
    }, [])

    return (
        <div style={{ width: '100%', padding: "20px" }}>
            <div style={calculateButton}>Calculator</div>
            <IconButton sx={{ ...IconButtonStyle, width: "150px" }} size='large' onClick={calculateScore}>
                <CalculateIcon fontSize='large' />
                <div style={{ margin: "5px 15px" }}>{score}</div>
            </IconButton>
            <IconButton sx={{ ...IconButtonStyle, width: "68px", height: "68px", marginLeft: "10px" }} size='large' onClick={() => { setOpen(!open) }}>
                {open?<GiCricketBat size={130} />:<FaBaseballBall/>}
            </IconButton>
            <IconButton sx={{ ...IconButtonStyle, width: "68px", height: "68px", marginLeft: "10px" }} size='large' onClick={saveScore}>
                <DoneIcon fontSize='large' />
            </IconButton>
            <Collapse in={open}>
                <div style={containerBackground}>
                    <div style={containerTitle}>PPL&nbsp;<Button onClick={() => handleRemoveplayer("BAT", "PPL")}>Clear</Button></div>
                    <div style={containerBody}>
                        {split["BAT"]["PPL"] ? split['BAT']['PPL'].map((player, key) => (
                            <PlayerCard key={key} image={player.image} color={player.color} name={player.name} overall={player.overall} bat_ppl={player.bat_ppl} bat_mid={player.bat_mid} bat_death={player.bat_death} bow_ppl={player.bow_ppl} bow_death={player.bow_death} bow_mid={player.bow_mid} type={player.type}
                                foreign={player.foreign} is_starred={player.is_starred} is_wk={player.is_wk} is_uncapped={player.is_uncapped} price="0" id={player.id} style={{height:"220px"}} />
                        )) : null}
                    </div>
                </div>
                <div style={containerBackground}>
                    <div style={containerTitle}>MO&nbsp;<Button onClick={() => handleRemoveplayer("BAT", "MO")}>Clear</Button></div>
                    <div style={containerBody}>
                        {split["BAT"]["MO"] ? split['BAT']['MO'].map((player, key) => (
                                <PlayerCard key={key} image={player.image} color={player.color} name={player.name} overall={player.overall} bat_ppl={player.bat_ppl} bat_mid={player.bat_mid} bat_death={player.bat_death} bow_ppl={player.bow_ppl} bow_death={player.bow_death} bow_mid={player.bow_mid} type={player.type}
                                    foreign={player.foreign} is_starred={player.is_starred} is_wk={player.is_wk} is_uncapped={player.is_uncapped} price="0" id={player.id} style={{height:"220px"}} />
                        )) : null}
                    </div>
                </div>
                <div style={containerBackground}>
                    <div style={containerTitle}>DTH&nbsp;<Button onClick={() => handleRemoveplayer("BAT", "DEATH")}>Clear</Button></div>
                    <div style={containerBody}>
                        {split["BAT"]["DEATH"] ? split['BAT']['DEATH'].map((player, key) => (
                                <PlayerCard key={key} image={player.image} color={player.color} name={player.name} overall={player.overall} bat_ppl={player.bat_ppl} bat_mid={player.bat_mid} bat_death={player.bat_death} bow_ppl={player.bow_ppl} bow_death={player.bow_death} bow_mid={player.bow_mid} type={player.type}
                                    foreign={player.foreign} is_starred={player.is_starred} is_wk={player.is_wk} is_uncapped={player.is_uncapped} price="0" id={player.id} style={{height:"220px"}} />
                        )) : null}
                    </div>
                </div>
                <Grid item xs={12} style={{ width: "100%", display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
                    {batsman ? batsman.map((player, key) => (
                        <div key={key}>
                            <PlayerCard  image={player.image} color={player.color} name={player.name} overall={player.overall} bat_ppl={player.bat_ppl} bat_mid={player.bat_mid} bat_death={player.bat_death} bow_ppl={player.bow_ppl} bow_death={player.bow_death} bow_mid={player.bow_mid} type={player.type}
                                foreign={player.foreign} is_starred={player.is_starred} is_wk={player.is_wk} is_uncapped={player.is_uncapped} price={player.price} id={player.id} playing11={player.playing11} type={player.type} price="0" calculator={true}>
                                <ButtonGroup>
                                {split['BAT']['PPL'].length<4 && player['count']<2 && !player['PPL']?<Button variant='contained' color='warning' onClick={() => handleAddPlayer("BAT", "PPL", player)} >PPL</Button>:null}
                                {split['BAT']['MO'].length<4 && player['count']<2 && !player['MO']?<Button variant='contained' color='warning' onClick={() => handleAddPlayer("BAT", "MO", player)} >MO</Button>:null}
                                {split['BAT']['DEATH'].length<2 && player['count']<2 && !player['DEATH']?<Button variant='contained' color='warning' onClick={() => handleAddPlayer("BAT", "DEATH", player)}>DEATH</Button>:null}
                                {player['count']>=2?"Exhausted":null}
                                </ButtonGroup></PlayerCard>
                        </div>
                    )) : null}
                </Grid>
            </Collapse>
            <Collapse in={!open}>
                <div style={containerBackground}>
                    <div style={containerTitle}>PPL&nbsp;<Button onClick={() => handleRemoveplayer("BOWL", "PPL")}>Clear</Button></div>
                    <div style={containerBody}>
                        {split["BOWL"]["PPL"] ? split['BOWL']['PPL'].map((player, key) => (
                                <PlayerCard key={key} image={player.image} color={player.color} name={player.name} overall={player.overall} bat_ppl={player.bat_ppl} bat_mid={player.bat_mid} bat_death={player.bat_death} bow_ppl={player.bow_ppl} bow_death={player.bow_death} bow_mid={player.bow_mid} type={player.type}
                                    foreign={player.foreign} is_starred={player.is_starred} is_wk={player.is_wk} is_uncapped={player.is_uncapped} price="0" id={player.id} style={{height:"220px"}} />
                        )) : null}
                    </div>
                </div>
                <div style={containerBackground}>
                    <div style={containerTitle}>MO&nbsp;<Button onClick={() => handleRemoveplayer("BOWL", "MO")}>Clear</Button></div>
                    <div style={containerBody}>
                        {split["BOWL"]["MO"] ? split['BOWL']['MO'].map((player, key) => (
                            <div>
                                <PlayerCard key={key} image={player.image} color={player.color} name={player.name} overall={player.overall} bat_ppl={player.bat_ppl} bat_mid={player.bat_mid} bat_death={player.bat_death} bow_ppl={player.bow_ppl} bow_death={player.bow_death} bow_mid={player.bow_mid} type={player.type}
                                    foreign={player.foreign} is_starred={player.is_starred} is_wk={player.is_wk} is_uncapped={player.is_uncapped} price="0" id={player.id} style={{height:"220px"}} />
                            </div>
                        )) : null}
                    </div>
                </div>
                <div style={containerBackground}>
                    <div style={containerTitle}>DTH&nbsp;<Button onClick={() => handleRemoveplayer("BOWL", "DEATH")}>Clear</Button></div>
                    <div style={containerBody}>
                        {split["BOWL"]["DEATH"] ? split['BOWL']['DEATH'].map((player, key) => (
                                <PlayerCard key={key} image={player.image} color={player.color} name={player.name} overall={player.overall} bat_ppl={player.bat_ppl} bat_mid={player.bat_mid} bat_death={player.bat_death} bow_ppl={player.bow_ppl} bow_death={player.bow_death} bow_mid={player.bow_mid} type={player.type}
                                    foreign={player.foreign} is_starred={player.is_starred} is_wk={player.is_wk} is_uncapped={player.is_uncapped} price="0" id={player.id} style={{height:"220px"}} />
                        )) : null}
                    </div>
                </div>
                <Grid item xs={12} style={{ width: "100%", display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
                    {bowler ? bowler.map((player, key) => (
                        <PlayerCard key={key} image={player.image} color={player.color} name={player.name} overall={player.overall} bat_ppl={player.bat_ppl} bat_mid={player.bat_mid} bat_death={player.bat_death} bow_ppl={player.bow_ppl} bow_death={player.bow_death} bow_mid={player.bow_mid} type={player.type}
                            foreign={player.foreign} is_starred={player.is_starred} is_wk={player.is_wk} is_uncapped={player.is_uncapped} price={player.price} id={player.id} playing11={player.playing11} type={player.type}
                            price="0" calculator={true} >
                            <ButtonGroup>
                            {split['BOWL']['PPL'].length<3 && player['count']<2 && !player['PPL']?<Button variant='contained' color='warning' onClick={() => handleAddPlayer("BOWL", "PPL", player)} >PPL</Button>:null}
                            {split['BOWL']['MO'].length<3 && player['count']<2 && !player['MO']?<Button variant='contained' color='warning' onClick={() => handleAddPlayer("BOWL", "MO", player)} >MO</Button>:null}
                            {split['BOWL']['DEATH'].length<2 && player['count']<2 && !player['DEATH']?<Button variant='contained' color='warning' onClick={() => handleAddPlayer("BOWL", "DEATH", player)}>DEATH</Button>:null}
                            {player['count']>=2?"Exhausted":null}
                            </ButtonGroup></PlayerCard>
                    )) : null}
                </Grid>
            </Collapse>
        </div>
    )
}

export default Calculator;
