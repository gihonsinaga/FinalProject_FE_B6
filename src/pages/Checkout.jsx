import React, { useEffect, useState } from "react";
import Nav from "../component/Nav";
import Footer from "../component/Footer";
import { useSelector } from "react-redux";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const penumpangAdult = useSelector((state) => state.search.penumpang.adult);
  const penumpangChildren = useSelector(
    (state) => state.search.penumpang.children
  );
  const penumpangBaby = useSelector((state) => state.search.penumpang.baby);

  // --------------------------------------------------------------------
  // fungsi checkout

  const createInitialPassengerState = (count) => {
    return Array(count)
      .fill()
      .map((_, index) => ({
        title: "",
        fullName: "",
        familyName: "",
        birthDate: "",
        nationality: "",
        identityType: "",
        identityNumber: "",
        expiredDate: "",
        issuingCountry: "",
      }));
  };

  const [adultPassengers, setAdultPassengers] = useState(
    createInitialPassengerState(penumpangAdult)
  );
  const [childrenPassengers, setChildrenPassengers] = useState(
    createInitialPassengerState(penumpangChildren)
  );
  const [babyPassengers, setBabyPassengers] = useState(
    createInitialPassengerState(penumpangBaby)
  );

  const handleInputChange = (type, index, field, value) => {
    let newPassengers;
    if (type === "Adult") {
      newPassengers = [...adultPassengers];
      newPassengers[index][field] = value;
      setAdultPassengers(newPassengers);
    } else if (type === "Children") {
      newPassengers = [...childrenPassengers];
      newPassengers[index][field] = value;
      setChildrenPassengers(newPassengers);
    } else if (type === "Baby") {
      newPassengers = [...babyPassengers];
      newPassengers[index][field] = value;
      setBabyPassengers(newPassengers);
    }
  };

  const token = useSelector((state) => state.auth.token);

  const flightDetailId = useSelector((state) => state.ticket.id);
  // console.log("location.state", location.state);
  // console.log("flightDetaiIDd", flightDetailId);

  const [isInputVisible, setIsInputVisible] = useState(false);
  const [familyName, setFamilyName] = useState("");

  const handleToggle = () => {
    setIsInputVisible(!isInputVisible);
  };

  const handleInputFamilyName = (e) => {
    setFamilyName(e.target.value);
  };

  const orderTicket = async (data) => {
    try {
      const response = await axios.post(
        `https://express-development-3576.up.railway.app/api/v1/ticket/order/${flightDetailId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const idOrder = response.data.data.id;
      // console.log("Response:", response.data);
      // console.log("idOrder", idOrder);

      toast.success("Data Berhasil Tersimpan");
      setTimeout(() => {
        navigate("/payment", {
          state: { idOrder: idOrder, familyName: familyName },
        });
      }, 2000);
    } catch (error) {
      // console.error("Error fetching data:", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allPassengers = [
      ...adultPassengers.map((passenger) => ({
        title: passenger.title,
        fullname: passenger.fullName,
        family_name: passenger.familyName,
        birth_date: passenger.birthDate,
        nationality: passenger.nationality,
        identity_type: passenger.identityType,
        identity_number: passenger.identityNumber,
        expired_date: passenger.expiredDate,
        issuing_country: passenger.issuingCountry,
      })),
      ...childrenPassengers.map((passenger) => ({
        title: passenger.title,
        fullname: passenger.fullName,
        family_name: passenger.familyName,
        birth_date: passenger.birthDate,
        nationality: passenger.nationality,
        identity_type: "-",
        identity_number: "-",
        expired_date: "2030-01-01",
        issuing_country: "-",
      })),
      ...babyPassengers.map((passenger) => ({
        title: passenger.title,
        fullname: passenger.fullName,
        family_name: passenger.familyName,
        birth_date: passenger.birthDate,
        nationality: passenger.nationality,
        identity_type: "-",
        identity_number: "-",
        expired_date: "2030-01-01",
        issuing_country: "-",
      })),
    ];

    const data = { passengers: allPassengers };

    orderTicket(data);
  };

  // ---------------------------------------------------------------------------------------------------
  //form checkout function

  const createPassengerForms = (passengers, type) => {
    return passengers.map((passenger, index) => (
      <div key={`${type}-${index}`} className="mt-10">
        <div className="border  shadow-xl shadow-gray-400  rounded-xl pt-10 pb-14  px-4 max-sm:text-xs sm:text-sm max-sm:mx-3">
          <div className="text-slate-600 font-bold sm:text-lg mx-5 max-sm:text-center max-sm:text-lg">
            Isi Data Penumpang ({type})
          </div>
          <div className="flex mt-5 font-medium py-3 px-5 bg-black sm:w-[520px] text-white rounded-t-2xl sm:mx-5">
            Data Diri Penumpang
          </div>
          <div className="mt-5 sm:ml-5 text-slate-600 font-semibold">Title</div>
          <div className="mt-1 sm:ml-5">
            <select
              className="border px-2 border-gray-400 rounded sm:w-[520px] h-[40px] max-sm:w-full"
              value={passenger.title}
              onChange={(e) =>
                handleInputChange(type, index, "title", e.target.value)
              }
            >
              <option value=""></option>
              <option value="Mr">Mr.</option>
              <option value="Mrs">Mrs.</option>
            </select>
          </div>

          <div className="mt-5 sm:ml-5 text-slate-600 font-semibold">
            Nama Lengkap
          </div>
          <div className="mt-1 sm:ml-5">
            <input
              type="text"
              className="border px-2 border-gray-400 rounded sm:w-[520px] h-[40px] max-sm:w-full"
              value={passenger.fullName}
              onChange={(e) =>
                handleInputChange(type, index, "fullName", e.target.value)
              }
            />
          </div>

          <div className="mt-5 sm:ml-5 text-slate-600 font-semibold">
            Nama Keluarga
          </div>
          <div className="mt-1 sm:ml-5">
            <input
              type="text"
              className="border px-2 border-gray-400 rounded sm:w-[520px] h-[40px] max-sm:w-full"
              value={passenger.familyName}
              onChange={(e) =>
                handleInputChange(type, index, "familyName", e.target.value)
              }
            />
          </div>

          <div className="mt-5 sm:ml-5 text-slate-600 font-semibold">
            Tanggal Lahir
          </div>
          <div className="mt-1 sm:ml-5">
            <input
              type="date"
              className="border px-2 text-gray-400 border-gray-400 rounded sm:w-[520px] h-[40px] max-sm:w-full"
              value={passenger.birthDate}
              onChange={(e) =>
                handleInputChange(type, index, "birthDate", e.target.value)
              }
            />
          </div>

          <div className="mt-5 sm:ml-5 text-slate-600 font-semibold">
            Kewarganegaraan
          </div>
          <div className="mt-1 sm:ml-5">
            <input
              type="text"
              className="border px-2 border-gray-400 rounded sm:w-[520px] h-[40px] max-sm:w-full"
              value={passenger.nationality}
              onChange={(e) =>
                handleInputChange(type, index, "nationality", e.target.value)
              }
            />
          </div>

          {type === "Adult" && (
            <>
              <div className="mt-5 sm:ml-5 text-slate-600 font-semibold">
                Jenis Identitas
              </div>
              <div className="mt-1 sm:ml-5">
                <select
                  className="border px-2 border-gray-400 rounded sm:w-[520px] h-[40px] max-sm:w-full"
                  value={passenger.identity_type}
                  onChange={(e) =>
                    handleInputChange(
                      type,
                      index,
                      "identityType",
                      e.target.value
                    )
                  }
                >
                  <option value=""></option>
                  <option value="KTP">KTP</option>
                  <option value="Pasport">Pasport</option>
                </select>
              </div>

              <div className="mt-5 sm:ml-5 text-slate-600 font-semibold">
                Nomor Identitas
              </div>
              <div className="mt-1 sm:ml-5">
                <input
                  type="text"
                  className="border px-2 border-gray-400 rounded sm:w-[520px] h-[40px] max-sm:w-full"
                  value={passenger.identityNumber}
                  onChange={(e) =>
                    handleInputChange(
                      type,
                      index,
                      "identityNumber",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="mt-5 sm:ml-5 text-slate-600 font-semibold">
                Negara Penerbit
              </div>
              <div className="mt-1 sm:ml-5">
                <input
                  type="text"
                  className="border px-2 border-gray-400 rounded sm:w-[520px] h-[40px] max-sm:w-full"
                  value={passenger.issuingCountry}
                  onChange={(e) =>
                    handleInputChange(
                      type,
                      index,
                      "issuingCountry",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="mt-5 sm:ml-5 text-slate-600 font-semibold">
                Berlaku Sampai
              </div>
              <div className="mt-1 sm:ml-5">
                <input
                  type="date"
                  className="border px-2 text-gray-400 border-gray-400 rounded sm:w-[520px] h-[40px] max-sm:w-full"
                  value={passenger.expiredDate}
                  onChange={(e) =>
                    handleInputChange(
                      type,
                      index,
                      "expiredDate",
                      e.target.value
                    )
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>
    ));
  };

  // -------------------------------------------------------------------
  // ticket detail dr ticket reducers

  const ticket = useSelector((state) => state.ticket.detailTicket);
  // console.log("ticket", ticket);

  const allPassenger = useSelector((state) => state.ticket.allPassenger);
  // console.log("allPassenger", allPassenger);

  const formatDateFlight = (date) => {
    const dateObj = new Date(date);
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return dateObj.toLocaleDateString("en-GB", options).replace(/ /g, " ");
  };

  const formatPrice = (price) => {
    return `IDR ${price.toLocaleString("id-ID")}`;
  };

  //------------------------------------------------------------------------------------
  // detail user dari auth reducers

  const user = useSelector((state) => state.auth.user);
  // console.log("user", user);

  const isLogin = useSelector((state) => state.auth.isLoggedIn);
  // console.log("islogin", isLogin);

  // -----------------------------------------------------------------------------------
  // Countdown function

  const [countdown, setCountdown] = useState(900);
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
    }`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown > 1) {
          return prevCountdown - 1;
        } else {
          clearInterval(timer);
          alert("waktu habis silahkan ulangi pemesanan");
          navigate("/");
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  //---------------------------------------------------------------------------------------
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <div className="text-xs">
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
      <div className=" max-sm:h-[60px] ">
        <Nav isHomePage={false} />
        {/* <div className="container flex flex-col justify-center p-6 sm:py-12 sm:px-40 lg:py-20 lg:flex-row lg:justify-between"></div> */}
      </div>

      <div
        className={`flex sm:hidden justify-center sm:mt-10 tracking-wide font-semibold items-center p-3 sm:w-full text-white  max-sm:font-light max-sm:text-xs max-sm:italic ${
          isLogin ? "bg-slate-500" : "bg-red-500"
        }`}
      >
        {isLogin
          ? `Selesaikan dalam ${formatTime(countdown)}`
          : "Anda harus login terlebih dahulu"}
      </div>

      <div className="flex flex-col mx-auto sm:px-40 sm:mt-20">
        <div className="flex text-black font-bold sm:text-lg  max-sm:justify-center max-sm:text-sm  max-sm:mt-3 sm:mt-10 sm:ml-4">
          Isi Data Diri
          <div className="flex  text-gray-400">
            <div className="sm:ml-4 max-sm:ml-2">{">"}</div>
            <div className="sm:ml-4 max-sm:ml-2">Bayar</div>
            <div className="sm:ml-4 max-sm:ml-2">{">"}</div>
            <div className="sm:ml-4 max-sm:ml-2">Selesai</div>
          </div>
        </div>
        <div
          className={`flex max-sm:hidden justify-center sm:mt-2 tracking-wide sm:text-sm sm:font-medium items-center sm:p-4 sm:w-full text-white rounded-2xl max-sm:mx-5 max-sm:mt-3 max-sm:font-light max-sm:text-sm italic ${
            isLogin ? "bg-slate-500" : "bg-red-500"
          }`}
        >
          {isLogin
            ? `Selesaikan dalam ${formatTime(countdown)}`
            : "Anda harus login terlebih dahulu"}
        </div>

        <div className="mt-10 flex justify-between sm:mx-4 max-sm:flex-wrap-reverse  ">
          {/* data user */}
          <div>
            <div className="border shadow-xl shadow-gray-400  rounded-xl pt-10 pb-14  px-5 max-sm:mx-3  max-sm:mt-10 max-sm:w-[full] max-sm:text-xs sm:text-sm ">
              <div className="text-slate-600 font-bold sm:text-lg sm:px-5 max-sm:text-center max-sm:text-lg">
                {" "}
                Cek Data Pemesan <span className="sm:hidden">Dibawah</span>
              </div>
              <div className="flex mt-5 font-medium py-3 px-5 sm:mx-5  bg-black sm:w-[520px]  text-white rounded-t-2xl  max-sm:w-full ">
                Data Diri Pemesan
              </div>
              <div className="mt-5 sm:ml-5 text-slate-600 font-semibold">
                Nama Lengkap
              </div>
              <div className="mt-1 p-2 border border-gray-400 rounded sm:w-[520px] h-[40px] mx-auto text-gray-500 max-sm:w-full">
                {user?.data?.fullname}
              </div>
              <div className="mt-5 sm:ml-5 text-slate-600 font-semibold">
                Punya Nama Keluarga ?
                <button
                  onClick={handleToggle}
                  className="ml-3 px-5 py-1 bg-slate-500 text-white rounded-full text-xs"
                  disabled={!isLogin}
                >
                  {isInputVisible ? "tidak" : "ya"}
                </button>
                {isInputVisible && (
                  <div className="mt-1  border border-gray-400 rounded sm:w-[520px] h-[40px] mx-auto text-gray-500 max-sm:w-full sm:-ml-0.5">
                    <input
                      type="text"
                      value={familyName}
                      onChange={handleInputFamilyName}
                      className="w-full h-full font-medium pl-2 "
                      placeholder="Masukkan Nama Keluarga"
                    />
                  </div>
                )}
              </div>
              <div className="mt-5 sm:ml-5 text-slate-600 font-semibold">
                Nomor Telepon
              </div>
              <div className="mt-1 p-2 border border-gray-400 rounded sm:w-[520px] h-[40px] mx-auto text-gray-500 max-sm:w-full ">
                {user?.data?.phoneNumber}
              </div>
              <div className="mt-5 sm:ml-5 text-slate-600 font-semibold">
                Email
              </div>
              <div className="mt-1 p-2 border border-gray-400 rounded sm:w-[520px] h-[40px] mx-auto text-gray-500 max-sm:w-full ">
                {user?.data?.email}
              </div>
            </div>

            {/* isi data penumpang */}
            {isLogin && (
              <form className="search" onSubmit={handleSubmit}>
                {createPassengerForms(adultPassengers, "Adult")}
                {createPassengerForms(childrenPassengers, "Children")}
                {createPassengerForms(babyPassengers, "Baby")}
                <div className="mt-7 max-sm:mx-3">
                  <button
                    type="submit"
                    className="bg-slate-500 text-white rounded-lg  sm:w-[600px] sm:h-[50px] shadow-xl shadow-gray-400 max-sm:w-full max-sm:h-[40px] max-sm:mb-10 max-sm:text-xs sm:text-sm "
                  >
                    Simpan
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="max-sm:w-full">
            <div className="sm:w-[520px] max-sm:text-xs max-sm:mx-3 sm:text-sm border border-gray-300 rounded p-4">
              {/* <div className="border-gray-300 border-b-2 mb-3 max-sm:-mt-3"></div> */}
              <div className="text-gray-700 flex flex-col text-left">
                <div className="font-bold mb-2 sm:text-lg text-black max-sm:text-sm">
                  Detail Penerbangan
                </div>
                <div className="flex justify-between">
                  <div>
                    <div className="font-bold">{ticket?.time_departure}</div>
                    <div>{formatDateFlight(ticket?.date_flight)}</div>
                    <div className="font-medium">
                      {ticket?.city_arrive?.airport_name}
                    </div>
                    <div className="font-bold">{ticket?.city_arrive?.name}</div>
                  </div>
                  <div className="mt-6 text-slate-600 font-bold">
                    Keberangkatan
                  </div>
                </div>
              </div>
              <div className="border-gray-300 border-b-2 my-3"></div>
              <div className="text-gray-700 flex flex-col text-left">
                <div className="font-bold">
                  {ticket?.flightPlane?.name} - {ticket?.flightSeat}
                </div>
                <div className="font-bold">{ticket?.flight_number}</div>
                <div className="mt-2 font-bold">Informasi :</div>
                <div>Baggage 20 kg</div>
                <div>Cabin baggage 7 kg</div>
                <div>In Flight Entertainment</div>
              </div>
              <div className="border-gray-300 border-b-2 my-3"></div>
              <div className="text-gray-700 flex flex-col text-left">
                <div className="flex justify-between">
                  <div>
                    <div className="font-bold">{ticket?.time_arrive}</div>
                    <div>{formatDateFlight(ticket?.date_flight)}</div>
                    <div className="font-medium">
                      {ticket?.city_destination?.airport_name}
                    </div>
                    <div className="font-bold">
                      {ticket?.city_destination?.name}
                    </div>
                  </div>
                  <div className="mt-6 text-slate-600 font-bold">
                    Kedatangan
                  </div>
                </div>
                <div className="border-gray-300 border-b-2 my-3"></div>
                <div>
                  <div className="font-bold">Rincian Harga</div>

                  <div className="flex justify-between">
                    <div>{allPassenger?.adult} adult</div>
                    <div>
                      {formatPrice(ticket?.price * allPassenger?.adult)}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>{allPassenger?.children} children</div>
                    <div>
                      {formatPrice(ticket?.price * allPassenger?.children)}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>{allPassenger?.baby} baby</div>
                    <div>{formatPrice(ticket?.price * allPassenger?.baby)}</div>
                  </div>
                </div>

                <div className="border-gray-300 border-b-2 my-3"></div>
                <div className="flex justify-between">
                  <div className=" font-bold sm:text-base text-black">
                    Total Harga
                  </div>
                  <div className="text-red-500 font-bold sm:text-lg">
                    {ticket?.totalPrice !== null
                      ? formatPrice(ticket.totalPrice)
                      : formatPrice(ticket?.price)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20 max-sm:hidden">
        <Footer />
      </div>
    </div>
  );
}
