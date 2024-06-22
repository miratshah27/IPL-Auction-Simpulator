import { Grid, Paper, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../AxiosInstance';
import PlayerCard from '../Components/PlayerCard';

function Search() {

  const [searchText, setSearchText] = useState();

    const handleSearchText = (event) => {
        setSearchText(event.target.value);
    }

    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const getPlayers = async () => {
            const response = (await axiosInstance.get(`search/${searchText}`)).data;
            setSearchResults(response);
        }
        getPlayers();
    }, [searchText]);

  return (
    <div style={{ padding: "20px",width:"100%" }}>
      <Paper elevation={6} sx={{background:"black",background:"white",marginBottom:'20px'}}>
        <TextField id="filled-basic" label="Type here to search" sx={{width:"100%"}} variant="filled"  onChange={handleSearchText} value={searchText} />
      </Paper>

      <Grid item xs={12} style={{width:"100%",display:"flex",justifyContent:"center",flexWrap:"wrap"}}>
        {searchResults.map((player, key) => (
          <PlayerCard key={key} image={player.image} color={player.color} name={player.name} overall={player.overall} bat_ppl={player.bat_ppl} bat_mid={player.bat_mid} bat_death={player.bat_death} bow_ppl={player.bow_ppl} bow_death={player.bow_death} bow_mid={player.bow_mid} foreign={player.foreign} is_starred={player.is_starred} is_wk={player.is_wk} is_uncapped={player.is_uncapped} price="0" type={player.type} retainedBy={player.retainedBy} style={{height:"220px"}}/>
        ))}
        </Grid>
    </div>
  )
}

export default Search;
