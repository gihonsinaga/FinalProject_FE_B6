import React, { useEffect, useRef, useState } from "react";
import "../index.css";
import { useNavigate, useLocation } from "react-router-dom";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setFromDestination,
  setPenumpang,
  setSeatClass,
  setStartDate,
  setToDestination,
} from "../redux/reducers/searchReducers";
import toast, { Toaster } from "react-hot-toast";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  //----------------------------------------------------------------------------------------------------- MODAL FUNCTION - START

  //* state untuk (OPEN MODAL) from and to airport
  const [openFromModal, setOpenFromModal] = useState(false);
  const [openToModal, setOpenToModal] = useState(false);
  const onOpenFromModal = () => setOpenFromModal(true);
  const onCloseFromModal = () => setOpenFromModal(false);
  const onOpenToModal = () => setOpenToModal(true);
  const onCloseToModal = () => setOpenToModal(false);

  // state untuk (OPEN MODAL) passenger modal
  const [openPassengerModal, setOpenPassengerModal] = useState(false);
  const onOpenPassengerModal = () => setOpenPassengerModal(true);
  const onClosePassengerModal = () => setOpenPassengerModal(false);

  //state untuk(OPEN MODAL) seat modal
  const [openSeatModal, setOpenSeatModal] = useState(false);
  const onOpenSeatModal = () => setOpenSeatModal(true);
  const onCloseSeatModal = () => setOpenSeatModal(false);

  //fungsi swap destinasi
  const swapDestinations = () => {
    const temp = fromDestination;
    dispatch(setFromDestination(toDestination));
    dispatch(setToDestination(temp));
  };

  //----------------------------------------------------------------------------------------------------- MODAL FUNCTION -- END

  //* ------- state simpan input pilihan user (sudah redux) -----------
  const {
    fromDestination,
    toDestination,
    startDate,
    fromDate,
    penumpang,
    totalPenumpang,
    seatClass,
  } = useSelector((state) => state.search);
  const dispatch = useDispatch();

  // 1. from city , to city input user (sudah redux)
  const handleFromInputChange = (e) => {
    dispatch(setFromDestination(e.target.value));
  };
  const handleToInputChange = (e) => {
    dispatch(setToDestination(e.target.value));
  };

  // 2. date jadwal penerbangan input user (sudah redux)
  const handleDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      dispatch(setStartDate(date.toISOString()));
    }
  };

  // 3. penumpang dan jumlah penumpang input user (sudah redux)
  const handleOption = (name, operation) => {
    const updatedPenumpang = {
      ...penumpang,
      [name]: operation === "i" ? penumpang[name] + 1 : penumpang[name] - 1,
    };
    dispatch(setPenumpang(updatedPenumpang));
  };

  // 4. seat class input user (sudah redux)
  // const handleSeatChange = (e) => {
  //   dispatch(setSeatClass(e.target.value));
  // };

  // ----------------------------------------------------------------------------------------------------- SEARCH FUNCTION (sudah redux) -- END

  //----------------------------------------------------------------------------------------------------- FUNCTION FETCHING API SEARCH - START

  // state penting untuk parameter endpoint search api,

  // console.log("fromDestination", fromDestination);
  // console.log("toDestination", toDestination);
  // console.log("startDate", fromDate.startDate);
  // console.log("penumpang", penumpang);
  // console.log("seatClass", seatClass);

  let data = {
    city_arrive_id: fromDestination,
    city_destination_id: toDestination,
    date_departure: fromDate,
    seat_class: seatClass,
    passenger: {
      adult: penumpang.adult,
      children: penumpang.children,
    },
    sorting: {
      sortAsc: false,
      price_from: 0,
      price_to: 10000000000,
      time_departure_from: "00:00",
      time_departure_to: "24:00",
    },
  };

  // -- Fetching Search API
  const handleSearch = (e) => {
    e.preventDefault();
    axios
      .post(
        "https://expressjs-production-53af.up.railway.app/api/v1/ticket/schedule?page=1",
        data
      )
      .then((response) => {
        //data ke searchresult pake use location
        let dataSearch = {
          data: response.data.data,
          penumpang1: totalPenumpang,
          seat_class: seatClass,
          penumpang2: penumpang,
        };
        // console.log("dataSearch", dataSearch);

        // console.log("api find ticket (search)", response?.data?.data);
        // const data = response?.data?.data;
        // setDataa(data);

        toast.success("Search Berhasil");
        setTimeout(() => {
          navigate("/SearchResult", { state: dataSearch });
        }, 2000);
      })
      .catch((error) => {
        // console.log("error", error);
        toast.error(error?.response?.data?.message);
      });
  };

  //----------------------------------------------------------------------------------------------------- FUNCTION FETCHING API SEARCH -- END

  const [city, setCity] = useState([]);
  const [city2, setCity2] = useState([]);

  const getCity = async () => {
    try {
      const response = await axios.get(
        "https://expressjs-production-53af.up.railway.app/api/v1/cities"
      );
      if (response.status === 200) {
        const dataCity = response.data.data;
        // console.log("response city", dataCity);
        setCity(dataCity);
        setCity2(dataCity);
      } else {
        // console.error("Error fetching seat class:", response);
      }
    } catch (error) {
      // console.error("Error fetching seat class:", error);
    }
  };

  const onSelectCity = (selectedCity) => {
    dispatch(setFromDestination(selectedCity.name));
    onCloseFromModal();
  };
  const onSelectCity2 = (selectedCity) => {
    dispatch(setToDestination(selectedCity.name));
    onCloseToModal();
  };

  // Use useEffect to fetch seat class on component mount
  useEffect(() => {
    getCity();
  }, []);

  // -----------------------------------------------------------------------------------------------------

  const [Class, setClass] = useState([]);
  const getSeatClass = async () => {
    try {
      const response = await axios.get(
        "https://expressjs-production-53af.up.railway.app/api/v1/ticket/class"
      );
      if (response.status === 200) {
        const dataClass = response.data.data;
        setClass(dataClass);
        // console.log("response class", dataClass);
      } else {
        // console.error("Error fetching seat class:", Class);
      }
    } catch (error) {
      // console.error("Error fetching seat class:", error);
    }
  };

  const handleSeatChange = (e) => {
    dispatch(setSeatClass(e.target.value));
  };

  const getClassName = (classId) => {
    switch (String(classId)) {
      case "1":
        return "Ekonomi";
      case "2":
        return "Ekonomi Premium";
      case "3":
        return "Bisnis";
      case "4":
        return "First Class";
      case "5":
        return "Quite Zone";
      default:
        return "Select Seat Class";
    }
  };

  useEffect(() => {
    getSeatClass();
  }, []);

  // console.log("seatClass", seatClass);

  return (
    <div>
      <div className="text-xs">
        {/* <Toaster position="bottom-right" reverseOrder={false} /> */}
      </div>
      {/* search feature */}
      <div className="flex flex-col bg-white mx-auto sm:mt-8 max-sm:w-full max-sm:h-[full] max-sm: sm:w-[1264px] sm:h-[300px] border-2 shadow-xl sm:rounded-3xl ">
        <div className=" sm:text-base  font-extrabold tracking-wide sm:ml-20 mt-7 max-sm:px-5 max-sm:hidden">
          Pilih Jadwal Penerbangan spesial di{" "}
          <span className="text-blue-400 ml-1"> FlyNow !</span>
        </div>

        {/* //////////////////////////////////////////////////////////// */}
        {/* form search dekstop */}
        <form
          onSubmit={handleSearch}
          className="search hidden max-sm:text-sm"
          action=""
        >
          <div className="flex justify-start mt-10 pl-20">
            <div className="flex ">
              <img
                src="/assets/plane.png"
                alt=""
                className="w-[28px] h-[27px]"
              />
              <span className="pl-4 pr-1 text-gray-600 text-base">Dari</span>
              <div className="">
                <button
                  type="button"
                  onClick={onOpenFromModal}
                  className="ml-14 border-b-2 w-[350px] text-blue-400 text-base inline-flex items-center justify-start"
                >
                  {fromDestination}
                </button>
                <Modal open={openFromModal} onClose={onCloseFromModal} center>
                  <h2 className=" max-sm:text-sm sm:text-sm">
                    Masukkan Kota Asal
                  </h2>
                  <input
                    type="text"
                    value={fromDestination}
                    onChange={handleFromInputChange}
                    placeholder="Masukkan Kota atau Negara"
                    className="border p-2  max-sm:text-sm max-sm:mt-2 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={onCloseFromModal}
                    className="mt-4 sm:ml-2 p-2 px-5 bg-slate-500 text-white max-sm:text-xs sm:text-sm"
                  >
                    Simpan
                  </button>
                  <div className="mt-5 text-slate-900 font-semibold  max-sm:text-sm max-sm:mb-3 sm:text-sm">
                    Saran Pencarian
                  </div>
                  <div className="overflow-y-scroll h-[300px] max-sm:text-xs sm:text-sm">
                    {city.map((data) => (
                      <div
                        key={data.id}
                        className="cursor-pointer hover:bg-gray-200 p-2 max-sm:border-b-2 max-sm:mb-2 "
                        onClick={() => onSelectCity(data)}
                      >
                        {data.name}
                      </div>
                    ))}
                  </div>
                </Modal>
              </div>
            </div>

            <div className="flex px-10">
              <button type="button" onClick={swapDestinations} className="">
                {" "}
                <img src="assets/return.png" alt="" />
              </button>
            </div>

            <div className="flex ">
              <img
                src="/assets/plane.png"
                alt=""
                className="w-[28px] h-[27px]"
              />
              <span className="pl-4 pr-1 text-gray-600 text-base">Ke</span>
              <div className="">
                <button
                  type="button"
                  onClick={onOpenToModal}
                  className="ml-12 border-b-2  w-[350px] text-blue-400 text-base inline-flex items-center justify-start"
                >
                  {toDestination}
                </button>
                <Modal open={openToModal} onClose={onCloseToModal} center>
                  <h2 className="max-sm:text-sm sm:text-sm">
                    Masukkan Kota Tujuan
                  </h2>
                  <input
                    type="text"
                    value={toDestination}
                    onChange={handleToInputChange}
                    placeholder="Masukkan Kota atau Negara tujuan"
                    className="border p-2 max-sm:text-sm max-sm:mt-2 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={onCloseToModal}
                    className="mt-4 sm:ml-2 p-2 px-5 bg-slate-500 text-white max-sm:text-xs sm:text-sm"
                  >
                    Simpan
                  </button>
                  <div className="mt-5 text-slate-900 font-semibold max-sm:text-sm max-sm:mb-3 sm:text-sm">
                    Saran Pencarian
                  </div>
                  <div>
                    {" "}
                    <div className="overflow-y-scroll h-[300px] max-sm:text-xs sm:text-sm">
                      {city2.map((data) => (
                        <div
                          key={data.id}
                          className="cursor-pointer hover:bg-gray-200 p-2 max-sm:border-b-2 max-sm:mb-2"
                          onClick={() => onSelectCity2(data)}
                        >
                          {data.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </div>

          <div className="flex justify-start mt-10 ml-20">
            <div className="flex ">
              <img
                src="/assets/calender.png"
                alt=""
                className="w-[28px] h-[27px]"
              />
              <span className="pl-4 pr-1 text-gray-600 text-base">Waktu</span>
              <span className="pl-9 pr-1 text-gray-500 text-base">
                Keberangkatan
              </span>
              <div className="absolute pl-20 pt-7 text-blue-400 text-base">
                <div className="flex pl-14 pt-3">
                  <div className="border-b-2 max-w-[130px]">
                    <DatePicker
                      selected={startDate ? new Date(startDate) : null}
                      onChange={handleDateChange}
                      dateFormat="dd MMM yyyy"
                      className="cursor-pointer ml-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex ml-72 pl-2 ">
              <img
                src="/assets/chair.png"
                alt=""
                className="w-[28px] h-[27px]"
              />
              <span className="pl-2 pr-1 text-gray-600 text-base ">Bangku</span>
              <span className="pl-8 pr-1 text-gray-500 text-base">
                Penumpang
              </span>

              <div className="absolute pl-32 pt-9 text-base">
                <span
                  onClick={onOpenPassengerModal}
                  className="cursor-pointer border-b-2 p-2 text-slate-500"
                >
                  {`${totalPenumpang} penumpang`}
                </span>
                <Modal
                  open={openPassengerModal}
                  onClose={onClosePassengerModal}
                  center
                >
                  <h2 className="mb-5 text-center font-bold max-sm:text-sm sm:text-sm">
                    Pilih Penumpang
                  </h2>
                  <div className="my-2 sm:mx-4 max-sm:text-xs sm:text-sm">
                    <div className="flex justify-between my-2 border-b-2 p-2">
                      <div className="flex text-gray-700 sm:pr-10">
                        <div className="sm:mr-4 mt-2">
                          <img
                            src="assets/adult.svg"
                            alt=""
                            className="w-[11px]  max-sm:hidden"
                          />
                        </div>
                        <div>
                          <div className="font-bold ">Dewasa</div>
                          <div className="sm:text-xs max-sm:text-[10px] text-gray-400">
                            (12 tahun keatas)
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-black sm:ml-16">
                        <button
                          type="button"
                          disabled={penumpang.adult <= 1}
                          className="sm:w-8 sm:h-8 max-sm:w-6 max-sm:h-6 border border-slate-700 text-slate-700 cursor-pointer bg-white disabled:cursor-not-allowed"
                          onClick={() => handleOption("adult", "d")}
                        >
                          -
                        </button>
                        <span className="border-b-2  sm:w-[40px] py-1 sm:mx-2 text-center">
                          {penumpang.adult}
                        </span>
                        <button
                          type="button"
                          className="sm:w-8 sm:h-8 max-sm:w-6 max-sm:h-6 border border-slate-700 text-slate-700  cursor-pointer bg-white"
                          onClick={() => handleOption("adult", "i")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between my-2 border-b-2 p-2 ">
                      <div className="flex text-gray-700 pr-10">
                        <div className="sm:mr-3 mt-2">
                          <img
                            src="assets/children.svg"
                            alt=""
                            className="w-[15px]  max-sm:hidden"
                          />
                        </div>
                        <div>
                          <div className="font-bold">Anak-Anak</div>
                          <div className="sm:text-xs max-sm:text-[10px] text-gray-400">
                            (2-11 tahun)
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-black">
                        <button
                          type="button"
                          disabled={penumpang.children <= 0}
                          className="sm:w-8 sm:h-8 max-sm:w-6 max-sm:h-6 border border-slate-700 text-slate-700  cursor-pointer bg-white disabled:cursor-not-allowed"
                          onClick={() => handleOption("children", "d")}
                        >
                          -
                        </button>
                        <span className="border-b-2 sm:w-[40px] py-1 sm:mx-2 text-center">
                          {penumpang.children}
                        </span>
                        <button
                          type="button"
                          className="sm:w-8 sm:h-8 max-sm:w-6 max-sm:h-6 border border-slate-700 text-slate-700  cursor-pointer bg-white"
                          onClick={() => handleOption("children", "i")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between my-2 border-b-2 p-2">
                      <div className="flex text-gray-700 pr-10">
                        <div className="sm:mr-3 mt-2">
                          <img
                            src="assets/Baby.svg"
                            alt=""
                            className="w-[15px] max-sm:hidden"
                          />
                        </div>
                        <div>
                          <div className="font-bold">Bayi</div>
                          <div className="sm:text-xs max-sm:text-[10px] text-gray-400">
                            (dibawah 2 tahun)
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-black">
                        <button
                          type="button"
                          disabled={penumpang.baby <= 0}
                          className="sm:w-8 sm:h-8 max-sm:w-6 max-sm:h-6 border border-slate-700 text-slate-700  cursor-pointer bg-white disabled:cursor-not-allowed"
                          onClick={() => handleOption("baby", "d")}
                        >
                          -
                        </button>
                        <span className="border-b-2 sm:w-[40px] py-1 sm:mx-2 text-center">
                          {penumpang.baby}
                        </span>
                        <button
                          type="button"
                          className="sm:w-8 sm:h-8 max-sm:w-6 max-sm:h-6 border border-slate-700 text-slate-700  cursor-pointer bg-white"
                          onClick={() => handleOption("baby", "i")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={onClosePassengerModal}
                      className="mt-4 py-2 sm:ml-72 px-10 bg-slate-500 text-white max-sm:text-xs"
                    >
                      Simpan
                    </button>
                  </div>
                </Modal>
              </div>

              <div className="pl-16 text-gray-500 text-base">
                Kelas
                <div className="text-blue-400 text-base">
                  <button
                    type="button"
                    onClick={onOpenSeatModal}
                    className="mt-2 border-b-2 w-[170px] text-blue-400 text-base inline-flex items-center justify-start"
                  >
                    {getClassName(seatClass)}
                  </button>
                  <Modal open={openSeatModal} onClose={onCloseSeatModal} center>
                    <div>
                      <h2 className="max-sm:text-sm sm:text-sm">
                        Pilih Kelas Bangku
                      </h2>
                      <select
                        value={seatClass}
                        onChange={handleSeatChange}
                        className="border p-2 max-sm:text-xs max-sm:mt-3 sm:text-sm "
                      >
                        {Class.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.type_class}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={onCloseSeatModal}
                        className="mt-4 sm:ml-2 max-sm:ml-2 p-2 px-5 bg-slate-500 text-white max-sm:text-xs sm:text-sm"
                      >
                        Simpan
                      </button>
                    </div>
                  </Modal>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className=" text-sm  font-bold mt-8 bg-slate-500 text-white w-[1263px] py-4 rounded-b-3xl"
          >
            Cari Penerbangan
          </button>
        </form>

        {/* //////////////////////////////////////////////////////////// */}
        {/* form search mobile */}
        <form
          onSubmit={handleSearch}
          className="mobile-search p-4 sm:hidden text-xs"
        >
          {/* From Destination */}
          <div className="mb-4">
            <label className="block text-gray-700 text-xs font-bold mb-2 mt-5">
              Dari
            </label>
            <button
              type="button"
              onClick={onOpenFromModal}
              className="w-full p-2 text-left border rounded text-blue-400"
            >
              {fromDestination || "Pilih kota asal"}
            </button>
          </div>

          {/* Swap button */}
          <div className="text-center">
            <button type="button" onClick={swapDestinations} className="">
              {" "}
              ⇅
            </button>
          </div>

          {/* To Destination */}
          <div className="mb-4">
            <label className="block text-gray-700 text-xs font-bold mb-2 ">
              Ke
            </label>
            <button
              type="button"
              onClick={onOpenToModal}
              className="w-full p-2 text-left border rounded text-blue-400"
            >
              {toDestination || "Pilih kota tujuan"}
            </button>
          </div>

          {/* Date */}
          <div className="mb-4">
            <label className="block text-gray-700 text-xs font-bold mb-2 mt-5">
              Tanggal Keberangkatan
            </label>
            <div className="border p-2 ">
              <DatePicker
                selected={startDate ? new Date(startDate) : null}
                onChange={handleDateChange}
                dateFormat="dd MMM yyyy"
                className="cursor-pointer text-blue-500 "
              />
            </div>
          </div>

          {/* Passengers */}
          <div className="mb-4">
            <label className="block text-gray-700 text-xs font-bold mb-2 mt-5">
              Penumpang
            </label>
            <button
              type="button"
              onClick={onOpenPassengerModal}
              className="w-full p-2 text-left border rounded text-blue-400"
            >
              {`${totalPenumpang} penumpang`}
            </button>
          </div>

          {/* Seat Class */}
          <div className="mb-4">
            <label className="block text-gray-700 text-xs font-bold mb-2 mt-5">
              Kelas
            </label>
            <button
              type="button"
              onClick={onOpenSeatModal}
              className="w-full p-2 text-left border rounded text-blue-400"
            >
              {getClassName(seatClass)}
            </button>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full bg-slate-600 text-white font-bold py-2 px-4 sm:rounded max-sm:mt-5 max-sm:text-[10px]"
          >
            Cari Penerbangan
          </button>
        </form>
      </div>
    </div>
  );
}
