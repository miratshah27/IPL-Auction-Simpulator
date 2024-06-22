import React, { useEffect, useState } from 'react'
import axiosInstance from '../AxiosInstance';
import styles from '../css/LandingPage.module.css'


function LandingPage() {

  const [inputToken,setInputToken] = useState();
  
  useEffect(() => {
    if(localStorage.getItem('token')){
      axiosInstance.post("verify",{token:localStorage.getItem('token')}).then((res)=>{
        if(res.data === "Success"){
          window.location.href = '/app/dashboard'
        }
      })
    }
  }, [])
  

  const verifyToken = () =>{
    localStorage.setItem('token',inputToken)
    axiosInstance.post("verify",{token:inputToken}).then((res)=>{
      if(res.data === "Success"){
        window.location.href = '/app/dashboard'
      }
      else{
        window.location.href = '/app/'
      }
    })
  };

  const handleInputTokenChange = (event) =>{
    setInputToken(event.target.value)
  };

    return (
      <div className={styles.background}>
        <p className={styles.anim_typewriter}>IPL Auction</p>
            <input className={styles.c_checkbox} type="checkbox" id="checkbox" style={{fontFamily:"bahnschrift"}}/>
            <div className={styles.c_formContainer}>
              <div className={styles.c_form}>
                <input className={styles.c_form__input} placeholder="Token" onChange={handleInputTokenChange} required/>
                <label className={styles.c_form__buttonLabel} htmlFor="checkbox" onClick={verifyToken}>
                  <button className={styles.c_form__button} type="button" onClick={verifyToken}>Send</button>
                </label>
                <label className={styles.c_form__toggle} htmlFor="checkbox" data-title="Login "></label>
              </div>
        </div>    
      </div>
    )
}

export default LandingPage
