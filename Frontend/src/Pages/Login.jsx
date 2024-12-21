import React from 'react'
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import styles from "../Styles/Sign_in.module.css"
function Login() {
    
    const navigate = useNavigate()

  return (
    <>
          <div className={styles.sign_in_wrapper}>
            <IoArrowBackSharp className={styles.back_btn} />
    
            <div className={styles.form_wrapper}>
              <form>
                
                {/* Email */}
                <div className={styles.form_group}>
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" placeholder="Enter your email" />
                </div>
    
                {/* Password */}
                <div className={styles.form_group}>
                  <label htmlFor="password">Password</label>
                  <input type="password" id="password" placeholder="Enter your password" />
                </div>
    
    
                {/* Sign Up Button */}
                <button type="submit" className={styles.signup_btn}>
                  Log In
                </button>
                   
                <div className={styles.or_text}>OR</div>
    
                {/* Sign Up with Google */}
                <button type="button" className={styles.google_btn}>
                  <div className={styles.google_wrapper}> <FcGoogle className={styles.google} /> </div> Sign Up with Google
                </button>
    
                {/* Login Link */}
                <p className={styles.login_text}>
                   Don’t have an account? <a onClick={()=>navigate("/sign-in")}>Register now</a>
                </p>
              </form>
            </div>
          </div>
    
          {/* SVGs */}
          <div className={styles.svgleft}>
            <img src="/svg_left.png" alt="" />
          </div>
          <div className={styles.svgright}>
            <img src="/Ellipse 2.png" alt="" />
          </div>
          <div className={styles.svgbottom}>
            <img src="/Ellipse 1.png" alt="" />
          </div>
        </>
  )
}

export default Login