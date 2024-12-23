import React, { useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../Styles/Sign_in.module.css";

function Sign_in() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));

    // Check password match
    if (id === "confirmPassword" || id === "password") {
      if (id === "confirmPassword" && value !== formData.password) {
        setPasswordError("enter same password in both fields");
      } else if (id === "password" && formData.confirmPassword && value !== formData.confirmPassword) {
        setPasswordError("enter same password in both fields");
      } else {
        setPasswordError("");
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      // API call
      const response = await axios.post("http://localhost:8000/api/v1/auth/signup", {
        username,
        email,
        password,
      });

      if (response.data) {
        toast.success("Registration successful!.");
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        })
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Server error. Please try again later.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className={styles.sign_in_wrapper}>
        <IoArrowBackSharp className={styles.back_btn} onClick={() => navigate("/")} />

        <div className={styles.form_wrapper}>
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className={styles.form_group}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Enter a username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className={styles.form_group}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className={styles.form_group}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Confirm Password */}
            <div className={styles.form_group}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {passwordError && <p className={styles.error_message}>{passwordError}</p>}
            </div>

            {/* Sign Up Button */}
            <button type="submit" className={styles.signup_btn}>
              Sign Up
            </button>

            <div className={styles.or_text}>OR</div>

            {/* Sign Up with Google */}
            <button type="button" className={styles.google_btn}>
              <div className={styles.google_wrapper}>
                <FcGoogle className={styles.google} />
              </div>{" "}
              Sign Up with Google
            </button>

            {/* Login Link */}
            <p className={styles.login_text}>
              Already have an account? <a onClick={() => navigate("/login")}>Login</a>
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
  );
}

export default Sign_in;
