import React, { useEffect } from "react";
import Nav from "../component/Nav";
import Footer from "../component/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function DonePayment() {
  const isLogin = useSelector((state) => state.auth.isLoggedIn);
  // console.log("islogin", isLogin);

  useEffect(() => {
    if (isLogin == false) {
      alert("Login dulu");
      navigate("/");
    }
  }, []);
  const navigate = useNavigate();
  const location = useLocation();

  // Tempat menampung data dari componen search
  const dataPayment = location.state;
  useEffect(() => {
    if (!dataPayment) {
      alert("pesan dulu");
      navigate("/");
    }
  }, []);
  // console.log("dataPayment", dataPayment);

  return (
    <div>
      <div className=" max-sm:h-[60px] ">
        <Nav isHomePage={false} />
        {/* <div className="container flex flex-col justify-center p-6 sm:py-12 sm:px-40 lg:py-20 lg:flex-row lg:justify-between"></div> */}
      </div>

      <div className="flex sm:hidden justify-center sm:mt-10 font-semibold items-center p-3  bg-slate-500 w-[full] text-white max-sm:text-center   max-sm:font-light max-sm:text-xs max-sm:italic">
        Terima Kasih atas pembayaran transaksi
      </div>

      <div className="flex flex-col mx-auto sm:px-40 sm:mt-20">
        <div className="flex text-black font-bold text-lg sm:mt-10 max-sm:justify-center max-sm:text-sm  max-sm:mt-3 sm:ml-4">
          Isi Data Diri
          <div className="flex  text-gray-400">
            <div className="sm:ml-4 max-sm:ml-2">{">"}</div>
            <div className="sm:ml-4 text-black max-sm:ml-2">Bayar</div>
            <div className="sm:ml-4 max-sm:ml-2">{">"}</div>
            <div className="sm:ml-4 max-sm:ml-2 text-black">Selesai</div>
          </div>
        </div>
        <div className="flex max-sm:hidden justify-center sm:mt-2 font-semibold text-sm items-center p-4  bg-slate-500 w-[full] text-white rounded-2xl max-sm:text-center max-sm:mx-5  max-sm:mt-3   max-sm:font-light max-sm:text-xs italic">
          Terima Kasih atas pembayaran transaksi
        </div>

        <div className="flex flex-col sm:mx-auto text-center justify-center">
          <div className=" mt-14 px-20">
            <img src="assets/donePayment.svg" alt="" className="w-[200px]" />
          </div>

          <div className="font-medium  mt-10 max-sm:text-xs">
            Transaksi pembayaran tiket sukses !
          </div>

          <div className="mt-5 max-sm:mx-5">
            <div
              onClick={() =>
                navigate("/history", { state: dataPayment?.payment?.order_id })
              }
              className="  bg-slate-500 max-sm:py-3 sm:py-4 sm:w-[400px] text-white rounded-2xl max-sm:w-[full] cursor-pointer max-sm:text-xs sm:text-sm"
            >
              Terbitkan tiket
            </div>
          </div>
          <div className="mt-2  max-sm:mx-5">
            <div
              onClick={() => navigate("/")}
              className="  bg-slate-400  max-sm:py-3 sm:py-4 sm:w-[400px] text-white rounded-2xl max-sm:w-[full] cursor-pointer max-sm:text-xs sm:text-sm"
            >
              Cari penerbangan lain
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20  max-sm:hidden">
        <Footer />
      </div>
    </div>
  );
}
