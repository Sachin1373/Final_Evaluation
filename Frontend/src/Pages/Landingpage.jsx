import React from 'react'
import styles from "../Styles/Landing.module.css"

function Landingpage() {
  return (
    <div className={styles.landing_wrapper}>
        <nav>
            <div className={styles.logo}>
               <img src="/Logo.png" alt="Logo" />
               <p>FormBot</p>
            </div>

            <div className={styles.sign_from_btn}>
                <button className={styles.signin}>Sign in</button>
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