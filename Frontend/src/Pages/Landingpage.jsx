import React, { useState,useContext } from 'react'
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../Contexts/AuthContext';
import styles from "../Styles/Landing.module.css";

function Landingpage() {
  const navigate = useNavigate();
 const {isLoggedIn,login,logout} = useContext(AuthContext)

  const handleClick = ()=>{
    if(isLoggedIn){
      console.log(isLoggedIn)
      navigate('/dashboard')
    }else{
      navigate('/login')
    }
  }

  const handlebtn = () =>{
    if(isLoggedIn){
      console.log(isLoggedIn)
      navigate('/dashboard')
    }else{
      navigate('/login')
    }
  }

  return (
    <div className={styles.landing_wrapper}>
      <nav>
        <div className={styles.logo}>
          <img src="/Logo.png" alt="Logo" />
          <p>FormBot</p>
        </div>

        <div className={styles.sign_from_btn}>
          <button className={styles.signin} onClick={() => navigate('/sign-in')}>Sign in</button>
          <button className={styles.create_bot} onClick={handleClick}>Create a FormBot</button>
        </div>
      </nav>

      <div className={styles.hero}>
        <div className={styles.hero_section}>
              <p className={styles.heading}>Build advanced chatbots
              visually</p>

              <p className={styles.sub_heading}>Typebot gives you powerful blocks to create unique chat experiences. Embed them
              anywhere on your web/mobile apps and start collecting results like magic.</p>

              <button onClick={handlebtn}>Create a FormBot  for free</button>
              <img src="/SVG_1.png" alt="icon" className={styles.icon_left}/>
              <img src="/SVG_2.png" alt="icon" className={styles.icon_right}/>
        </div>
         <div>
         <img src="/Hero_img.png" alt="" />
         </div>
      </div>

      <footer>
        <img src="/Footer.png" alt="" />
      </footer>
    </div>
  )
}

export default Landingpage;
