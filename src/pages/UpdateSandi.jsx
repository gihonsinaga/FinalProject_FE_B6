import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast"; // Import react-hot-toast
import "../index.css";
import loginPict from "../assets/login.png";
import ikon from "/assets/LogoFlyNow.svg";

export default function UpdateSandi() {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const getTokenFromUrl = () => {
    return new URLSearchParams(location.search).get("token");
  };

  useEffect(() => {
    const token = getTokenFromUrl();
    if (token == null) {
      toast.error("Please input your email first");
      navigate("/lupasandi");
    }
    // console.log("Token from URL:", token);
  }, [location]);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handlePasswordConfirmationChange = (event) => {
    setPasswordConfirmation(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = getTokenFromUrl();

    if (!password.trim() || !passwordConfirmation.trim()) {
      toast.error("Both password and password confirmation are required!!");
      return;
    }

    if (password !== passwordConfirmation) {
      toast.error(
        "Please ensure that the password and password confirmation match!"
      );
      return;
    }

    try {
      const response = await fetch(
        `https://express-development-3576.up.railway.app/api/v1/users/reset-password?token=${token}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password, passwordConfirmation }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Password Successfully Reset");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        if (response.status === 400) {
          toast.error(
            data.message ||
              "Both password and password confirmation are required!!"
          );
        } else if (response.status === 401) {
          toast.error(
            data.message ||
              "Please ensure that the password and password confirmation match!"
          );
        } else if (response.status === 403) {
          toast.error(data.message || "Invalid or expired token!");
        } else {
          toast.error(data.message || "An error occurred.");
        }
      }
    } catch (error) {
      // console.error("Network error:", error);
      toast.error("Failed to connect to the server.");
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-row-reverse">
        <div className="max-sm:hidden flex flex-1 justify-end w-full h-screen flex-shrink flex-grow">
          <img
            className="sm:w-full rounded-l-[70px]"
            src={loginPict}
            alt="Login"
          />
        </div>
        <div className="pt-24 md:pt-0 flex flex-1 justify-center items-center">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row pb-3">
              <img className="w-[50px]" src={ikon} alt="Login" />
              <h1 className="flex items-center pl-3 font-semibold text-2xl bg-gradient-to-r from-[#535F6B] to-[#C1DEE2] text-transparent bg-clip-text">
                FlyNow
              </h1>
            </div>
            <p className="text-[24px] font-semibold pt-8">Reset Password</p>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-3 w-full">
                <label>Password</label>
                <input
                  className="bg-gray-100 h-[40px] border-[2px] md:w-[400px] w-full border-gray-100 p-2 rounded-lg text-gray-700 focus:outline-none focus:bg-white focus:border-[#2193FA]"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <div className="flex flex-row justify-between mt-2">
                  <label>Confirm Password</label>
                </div>
                <input
                  className="bg-gray-100 h-[40px] border-[2px] md:w-[400px] w-full border-gray-100 p-2 rounded-lg text-gray-700 focus:outline-none focus:bg-white focus:border-[#2193FA]"
                  type="password"
                  value={passwordConfirmation}
                  onChange={handlePasswordConfirmationChange}
                  required
                />
              </div>
              <button
                className="shadow w-full h-[40px] self-center mt-3 bg-slate-500 hover:bg-slate-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded-lg"
                type="submit"
              >
                Reset Password
              </button>
            </form>
            <div>{message && <p>{message}</p>}</div>
          </div>
        </div>
      </div>
      <div className="text-xs">
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
    </div>
  );
}
