import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axiosInstance, { mediaUrl } from '../AxiosInstance';
import styles from '../css/PlayerCard.module.css'
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import StarIcon from '@mui/icons-material/Star';
import { Collapse } from '@mui/material';

function PlayerCard(props) {

  let navigate = useNavigate();

  const handlePlaying11 = (action, id) => {
    axiosInstance.post(`playing11/${action}`, { playerId: id })
    props.setChanged(!props.changed)
  }

  const [popup,setPopup] = useState(false);

  return (
    <div className={styles.background} style={{
      background: 'linear-gradient(45deg,' + props['color'] + ', #313131)',
      ...props.style
    }}>
      <div className={styles.top}>
        <img src={mediaUrl + props.image} onClick={()=>setPopup(!popup)} />

          <div style={{position:"absolute",height:"56px",background:"white",color:"black",borderRadius:"10px",textAlign:"center",border:"1px solid white",padding:'10px',width:"90px",zIndex:"1",display:(popup?"block":"none"),transform:"translateX(60px)",fontSize:"16px"}}>Can be retained by {props.retainedBy}</div>
        <div className={styles.basic}>
          <div>{props['name']}</div>
          <div>{props['type']}</div>
          <div style={{fontSize:"20px"}}>{props['overall']}</div>
          <div style={{ color: "white", transform: "scale(0.8)" }}>{props['foreign'] ? <AirplanemodeActiveIcon sx={{ verticalAlign: "bottom"}} /> : null}&nbsp;{props['is_starred'] ? <StarIcon sx={{verticalAlign:"bottom"}}/> : null}&nbsp;{props['is_wk'] ? "WK" : null}&nbsp;{props['is_uncapped'] ? "UN" : null}</div>
        </div>
      </div>
      <div className={styles.hr} />
      {props['price']!=0?
        <div className={styles.mid}>
          Price : {props['price']} CR
        </div>
      :null}
      <div className={styles.hr} />
      <div className={styles.bottom}>
        <div className={styles.stats}>
          <p style={{fontSize:"small",fontWeight:"500"}}>Bat</p>
          <div className={styles.hr}/>
          <h6>{props.bat_ppl} PPL</h6>
          <div className={styles.hr}/>
          <h6>{props.bat_mid} MO</h6>
          <div className={styles.hr}/>
          <h6>{props.bat_death} D</h6>
        </div>
        <div className={styles.stats}>
          <p style={{fontSize:"small",fontWeight:"500"}}>Bowl</p>
          <div className={styles.hr}/>
          <h6>{props.bow_ppl} PPL</h6>
          <div className={styles.hr}/>
          <h6>{props.bow_mid} MO</h6>
          <div className={styles.hr}/>
          <h6>{props.bow_death} D</h6>
        </div>
        </div>
        {props.calculator?
        <div style={{width:"100%",margin:"auto",textAlign:"center",transform:'translateY(10px)'}}>
        {props.children}
        </div>:null}
    </div>
  )
}

export default PlayerCard;
