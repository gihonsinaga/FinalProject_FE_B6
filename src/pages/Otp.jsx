import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import "../index.css";
import loginPict from "../assets/login.png";
import ikon from "../assets/iFon.svg";
import { FcGoogle } from "react-icons/fc";

export default function Otp() {
  const navigate = useNavigate();
  const loc = useLocation();
  const { email } = loc.state || {};
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef([]);
  const [countdown, setCountdown] = useState(120); // Countdown in seconds (2 minutes)
  const [canResend, setCanResend] = useState(false);

  // Start countdown on mount
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown > 1) {
          return prevCountdown - 1;
        } else {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle OTP input change
  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        otpRefs.current[index + 1].focus();
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join(""); // Join the otp array into a single string

    try {
      await axios.put(
        "https://expressjs-production-53af.up.railway.app/api/v1/users/verify-otp",
        {
          email: email,
          otp: otpCode,
        }
      );

      toast.success("OTP verification successful!");

      setTimeout(() => {
        navigate("/login", { state: { email } });
      }, 2000);
    } catch (error) {
      toast.error("OTP verification failed!");
      // console.error(error);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    try {
      await axios.put(
        "https://expressjs-production-53af.up.railway.app/api/v1/users/resend-otp",
        { email }
      );
      toast.success("OTP has been resent!");
      setCountdown(120); // Reset countdown to 2 minutes
      setCanResend(false);
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown > 1) {
            return prevCountdown - 1;
          } else {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
        });
      }, 1000);
    } catch (error) {
      toast.error("Failed to resend OTP!");
      // console.error(error);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
    }`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full">
      <Toaster position="top-right" reverseOrder={false} />

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
              <img className="" src={ikon} alt="Login" />
              <h1 className="flex items-center pl-3 font-semibold text-2xl bg-gradient-to-r from-[#2193FA] to-[#C1DEE2] text-transparent bg-clip-text">
                FlyNow
              </h1>
            </div>

            <p className="text-[24px] font-semibold pt-8">OTP</p>

            {/* Timer */}
            <p className="text-lg pb-4">
              {canResend
                ? "You can resend the OTP now."
                : `Resend OTP in ${formatTime(countdown)}`}
            </p>

            <div>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="flex flex-col gap-3 w-full">
                  <label>OTP</label>
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(e, index)}
                        ref={(el) => (otpRefs.current[index] = el)}
                        className="bg-gray-100 h-[40px] border-[2px] w-[40px] border-gray-100 p-2 rounded-lg text-gray-700 text-center focus:outline-none focus:bg-white focus:border-[#2193FA]"
                      />
                    ))}
                  </div>
                  <button
                    type="submit"
                    className="shadow w-full h-[40px] self-center mt-3 bg-[#2193FA] hover:bg-[#2154fa] focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Verifikasi OTP
                  </button>
                </div>
              </form>
            </div>

            <div>
              <div className="flex flex-row justify-center mt-3">
                <p className="">Tidak dapat kode?</p>
                <button
                  onClick={handleResendOtp}
                  className={`pl-1 font-bold ${
                    canResend
                      ? "text-blue-500 hover:underline"
                      : "text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!canResend}
                >
                  Kirim ulang
                </button>
              </div>
            </div>
          </div>

          <div>{/* Additional content */}</div>
        </div>
      </div>
    </div>
  );
}
