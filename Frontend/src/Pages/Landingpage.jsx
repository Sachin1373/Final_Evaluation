import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import styles from "../Styles/Landing.module.css";

function Landingpage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if the user is logged in
  const checkLoginStatus = () => {
    const storedUser = localStorage.getItem("userdetails");
    return storedUser ? JSON.parse(storedUser) : null;
  }

  // Handle the Create FormBot button click
  const handleClick = () => {
    const user = checkLoginStatus();

    if (user) {
      navigate('/dashboard'); // Navigate to dashboard if user is logged in
    } else {
      navigate('/sign-in'); // Navigate to sign-in if the user is not logged in
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
        <img src="/Hero_Section.png" alt="" />
      </div>

      <footer>
        <img src="/Footer.png" alt="" />
      </footer>
    </div>
  )
}

export default Landingpage;
