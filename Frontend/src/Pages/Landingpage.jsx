import React from 'react'
import { useNavigate } from "react-router-dom";
import styles from "../Styles/Landing.module.css"

function Landingpage() {
      const navigate = useNavigate();
  return (
    <div className={styles.landing_wrapper}>
        <nav>
            <div className={styles.logo}>
               <img src="/Logo.png" alt="Logo" />
               <p>FormBot</p>
            </div>

            <div className={styles.sign_from_btn}>
                <button className={styles.signin} onClick={()=>navigate('/sign-in')}>Sign in</button>
                <button className={styles.create_bot}>Create a FormBot</button>
            </div>
        </nav>

        <div className={styles.hero}>
            <img src="/Hero_Section.png" alt="" />
        </div>

        <footer>
            <img src="/Footer.png" alt="" />
        </footer>
    </div>
  )
}

export default Landingpage