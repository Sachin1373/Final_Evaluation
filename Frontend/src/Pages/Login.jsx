import React, { useState,useContext } from 'react'
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoArrowBackSharp } from "react-icons/io5";
import { AuthContext } from '../Contexts/AuthContext';
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import {createDashboard} from '../Api/dashboard'
import styles from "../Styles/Sign_in.module.css"
function Login() {

  const {isLoggedIn,login,logout} = useContext(AuthContext)
 

    const [logindata,setlogindata] = useState({
      email : "",
      password : "",
    })
    
    const navigate = useNavigate()

    const handleChange = (e) => {
      const { id, value } = e.target;
      setlogindata((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }

    const handlesubmit = async(e) =>{
      e.preventDefault();

      const {  email, password } = logindata;
      
          if (  !email || !password ) {
            toast.error("Please fill in all fields");
            return;
          }

          try {
            // API call
            const response = await axios.post("https://final-evaluation-qbj9.onrender.com/api/v1/auth/login", {
              email,
              password,
            });
      
            if (response.data) {
              const data = response.data;
              const expiryTime = new Date().getTime() + 12 * 60 * 60 * 1000; // 12 hours
              const userdata = {
                  token: data.token,
                  username: data.username,
                  expiry: expiryTime,
              };
              login(userdata)
              toast.success("Loggedin successful");
              setlogindata({
                email: "",
                password: "",
              });
              setTimeout(()=>{
                const redirectUrl = localStorage.getItem("redirectAfterLogin");
                  if (redirectUrl) {
                    localStorage.removeItem("redirectAfterLogin");
                    navigate(redirectUrl);
                  } else {
                    navigate("/dashboard");
                  }
                },1000)
            } else {
              toast.error(response.data.message || "Something went wrong");
            }
          } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Server error. Please try again later.");
          }

    }


    

  return (
    <>    
           <ToastContainer />
          <div className={styles.sign_in_wrapper}>
            <IoArrowBackSharp className={styles.back_btn} onClick={()=>navigate("/")} />
    
            <div className={styles.form_wrapper}>
              <form onSubmit={handlesubmit}>
                
                {/* Email */}
                <div className={styles.form_group}>
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" 
                  placeholder="Enter your email"
                  value={logindata.email}
                  onChange={handleChange} />
                </div>
    
                {/* Password */}
                <div className={styles.form_group}>
                  <label htmlFor="password">Password</label>
                  <input type="password" id="password" 
                  placeholder="Enter your password"
                  value={logindata.password}
                  onChange={handleChange} />
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