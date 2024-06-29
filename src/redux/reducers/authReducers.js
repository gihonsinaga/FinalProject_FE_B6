import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  isLoggedIn: null,
  user: null,
  showPassword: false,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setshowPassword: (state, action) => {
      state.showPassword = action.payload;
    },
    setRole: (state, action) =>{
      state.role = action.payload;
    }
  },
});

export const { setRole, setToken, setIsLoggedIn, setUser, setshowPassword } = authSlice.actions;
export default authSlice.reducer;