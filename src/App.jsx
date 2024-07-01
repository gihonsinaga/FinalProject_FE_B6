import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Home from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SearchResult from "./pages/SearchResult";
import Otp from "./pages/Otp";
import LupaSandi from "./pages/LupaSandi";
import UpdateSandi from "./pages/UpdateSandi";
import History from "./pages/History.jsx";
import Checkout from "./pages/Checkout.jsx";
import Payment from "./pages/Payment.jsx";
import PaymentOrder from "./pages/PaymentOrder.jsx";
import DonePayment from "./pages/DonePayment.jsx";
import Notifikasi from "./pages/Notifikasi";
import AdminPage from "./pages/AdminPage.jsx";
import Profile from "./pages/Profile.jsx";
import AdminPemesanan from "./pages/AdminPemesanan.jsx";
import AdminPenerbangan from "./pages/AdminPenerbangan.jsx";
import AdminPengguna from "./pages/AdminPenguna.jsx";
import AdminProfile from "./pages/AdminProfile.jsx";
import React from 'react';
import GoogleCallback from "./component/GoogleCallback";

function App() {
  return (
    <GoogleOAuthProvider clientId="273002041171-3dfn8sgqm2iepnts1bdmrtgr6i2ecjjn.apps.googleusercontent.com">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/searchresult" element={<SearchResult />} />
              <Route path="/Otp" element={<Otp />} />
              <Route path="/lupasandi" element={<LupaSandi />} />
              <Route path="/reset-password" element={<UpdateSandi />} />
              <Route path="/history" element={<History />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/paymentOrder" element={<PaymentOrder />} />
              <Route path="/donePayment" element={<DonePayment />} />
              <Route path="/notifikasi" element={<Notifikasi />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/pemesanan" element={<AdminPemesanan />} />
              <Route path="/admin/penerbangan" element={<AdminPenerbangan />} />
              <Route path="/admin/pengguna" element={<AdminPengguna />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
              <Route path="/google/callback" element={<GoogleCallback />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default App;