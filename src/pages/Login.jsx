import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { Toaster } from "react-hot-toast";
import "../index.css";
import loginPict from "../assets/login.png";
import ikon from "/assets/LogoFlyNow.svg";
// import { login } from "../redux/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import BottomNav from "../component/BottomNav";
// import ikon from "../assets/iFon.svg";
// import { useDispatch, useSelector } from "react-redux";
import { login, googleLogin } from "../redux/actions/authActions";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token !== null) {
      alert("Please log out first before signing up again");
      navigate("/");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let data = JSON.stringify({
      emailOrPhoneNumber: email,
      password: password,
    });

    // dispatch(login(data, navigate));
    const redirectTo = location.state?.from || "/";
    dispatch(login(data, navigate, redirectTo));
  };

  const handleGoogleLogin = () => {
    dispatch(googleLogin(navigate));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full">
      <div className="text-xs">
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
      <div className="flex flex-row-reverse">
        <div className="max-sm:hidden flex flex-1 justify-end w-full h-screen flex-shrink flex-grow">
          <img
            className="sm:w-full rounded-l-[70px]"
            src={loginPict}
            alt="Login"
          />
        </div>
        <div className="pt-24 md:pt-0 flex flex-1 justify-center items-center">
          <div className="flex flex-col gap-4 ">
            <div className="flex flex-row pb-3">
              <img className="w-[50px] " src={ikon} alt="Login" />
              <h1 className="flex items-center pl-3 font-semibold text-2xl bg-gradient-to-r from-[#535F6B] to-[#C1DEE2] text-transparent bg-clip-text">
                FlyNow
              </h1>
            </div>
            <p className="text-lg   font-semibold sm:pt-8 hidden">Login</p>
            <div>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="flex flex-col gap-3 w-full sm:text-sm max-sm:text-xs mt-10">
                  <label>Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-100 h-[40px] border-[2px] md:w-[400px] w-full border-gray-100 p-2 rounded-lg text-gray-700 focus:outline-none focus:bg-white focus:border-[#2193FA]"
                  />
                  <div className="flex flex-row justify-between mt-2 ">
                    <label>Password</label>
                    <a href="/lupasandi">Lupa Kata Sandi?</a>
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-100 h-[40px] border-[2px] md:w-[400px] w-full border-gray-100 p-2 rounded-lg text-gray-700 focus:outline-none focus:bg-white focus:border-[#2193FA]"
                  />
                  <button
                    type="submit"
                    className="shadow w-full h-[40px] self-center mt-3 bg-slate-500 hover:bg-slate-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 sm:px-4 max-sm:px-10 rounded-lg"
                  >
                    Masuk
                  </button>
                </div>
              </form>
            </div>
            <div>
              <div className="flex flex-row justify-center mt-3 sm:text-sm max-sm:text-xs">
                <p className="">Belum punya akun?</p>
                <Link
                  to="/register"
                  className="pl-1 font-bold text-blue-500 hover:underline max-sm:mr-20"
                >
                  Daftar disini
                </Link>
              </div>
            </div>
            <div className="border bt-2"></div>
            <button
              onClick={handleGoogleLogin}
              className="flex flex-row shadow w-full h-[40px] self-center mt-3 bg-slate-200 hover:bg-slate-300 focus:shadow-outline focus:outline-none text-black py-2 px-4 rounded-lg justify-center"
            >
              <FcGoogle className="mr-2 mt-1" />
              <span className="mt-1 max-sm:text-xs sm:text-sm">
                Masuk dengan Google{" "}
              </span>
            </button>
          </div>
          <div>{/* Additional content */}</div>
        </div>
      </div>
      <div className="sm:hidden mt-40">
        <BottomNav />
      </div>
    </div>
  );
}
