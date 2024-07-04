import axios from "axios";
import {
  setToken,
  setIsLoggedIn,
  setUser,
  setRole,
} from "../reducers/authReducers";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";

export const login = (data, navigate, redirectTo) => async (dispatch) => {
  // console.log("redirectPath", redirectTo);
  try {
    let config = {
      method: "post",
      url: "https://expressjs-production-53af.up.railway.app/api/v1/users/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    const response = await axios.request(config);
    if (response.data.status === true) {
      const { token, email } = response.data.data;
      // console.log("response", response.data.data);
      dispatch(setToken(token));
      dispatch(setIsLoggedIn(true));
      dispatch(setUser(email));
      toast.success("Login successful!");
      const role = response.data.data.role;
      // console.log("role", role);
      dispatch(setRole(role));
      setTimeout(() => {
        {
          if (role == "admin") {
            navigate("/admin");
          } else {
            navigate(redirectTo);
          }
        }
      }, 20);
    } else {
      toast.error(response.data.message || "Login failed!");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response.status === 403) {
        toast.error("Account not verified. Please check your email!");
      } else if (error.response.status === 400) {
        toast.error("Invalid email or password!");
      } else {
        toast.error("An error occurred during login!");
      }
      return;
    }
    toast.error("An error occurred during login!");
  }
};

export const register = (data, navigate) => async (dispatch) => {
  try {
    let config = {
      method: "post",
      url: "https://expressjs-production-53af.up.railway.app/api/v1/users/register",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    // Parse data untuk mendapatkan email
    const parsedData = JSON.parse(data);
    const email = parsedData.email;

    const response = await axios.request(config);
    const { token } = response.data;

    toast.success("Registration successful!");

    setTimeout(() => {
      navigate("/otp", { state: { email, token } });
    }, 2000);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response.status === 400) {
        toast.error(error.response.data.message);
      } else if (error.response.status === 401) {
        toast.error("Email already used!");
      } else {
        toast.error("An error occurred during register!");
      }
      // console.log("error.response.data.message", error.response.data.message);
      return;
    }
    toast.error("An error occurred during register!");
  }
};
export const logout = (navigate) => async (dispatch) => {
  try {
    // Reset state
    dispatch(setToken(null));
    dispatch(setIsLoggedIn(false));
    dispatch(setUser(null));

    // Hapus token dari localStorage atau sessionStorage jika ada
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    // toast.success("Logged out successfully!");
    navigate("/");
  } catch (error) {
    // console.error("Logout error:", error);
    toast.error("An error occurred during logout!");
  }
};

export const authenticateUser = () => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    if (token) {
      const response = await axios.get(
        "https://expressjs-production-53af.up.railway.app/api/v1/users/authenticate",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Asumsikan respons berisi data pengguna
      dispatch(setUser(response.data));
      // console.log("response", response.data);
      dispatch(setIsLoggedIn(true));
      // console.log('token', token)
    }
  } catch (error) {
    // console.error("Authentication error:", error);
    if (error.response && error.response.status === 401) {
      // Token tidak valid atau kadaluarsa
      dispatch(setToken(null));
      dispatch(setIsLoggedIn(false));
      dispatch(setUser(null));
      toast.error("Session expired. Please login again.");
      navigate("/login");
    } else {
      toast.error("An error occurred during authentication.");
    }
    // Anda juga bisa dispatch action khusus untuk error autentikasi jika diperlukan
  }
};

export const registerLoginWithGoogleAction =
  (accessToken, navigate) => async (dispatch) => {
    try {
      let data = JSON.stringify({
        access_token: accessToken,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://expressjs-production-53af.up.railway.app/api/v1/users/loginGoogle",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      const response = await axios.request(config);
      const { token, user } = response.data.data;

      dispatch(setToken(token));
      dispatch(setIsLoggedIn(true));
      dispatch(setUser(user.email));
      dispatch(setRole(user.role));
      localStorage.setItem("token", token);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response.data.message);
        return;
      }
      toast.error(error.message);
    }
    toast.error(error.message);
  };
