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

export default function Search3() {
  const navigate = useNavigate();
  const location = useLocation();

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
  const handleOption = (name, operation) => {
    const updatedPenumpang = {
      ...penumpang,
      [name]: operation === "i" ? penumpang[name] + 1 : penumpang[name] - 1,
    };
    dispatch(setPenumpang(updatedPenumpang));
  };

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

  const handleSearch = (e) => {
    e.preventDefault();
    axios
      .post(
        "https://express-development-3576.up.railway.app/api/v1/ticket/schedule?page=1",
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

        console.log("api find ticket (search)", response?.data?.data);
        // const data = response?.data?.data;
        // setDataa(data);

        toast.success("Search Berhasil");
        setTimeout(() => {
          navigate("/SearchResult", { state: dataSearch });
        }, 2000);
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error?.response?.data?.message);
      });
  };

  const [city, setCity] = useState([]);
  const [city2, setCity2] = useState([]);

  const getCity = async () => {
    try {
      const response = await axios.get(
        "https://express-development-3576.up.railway.app/api/v1/cities"
      );
      if (response.status === 200) {
        const dataCity = response.data.data;
        // console.log("response city", dataCity);
        setCity(dataCity);
        setCity2(dataCity);
      } else {
        console.error("Error fetching seat class:", response);
      }
    } catch (error) {
      console.error("Error fetching seat class:", error);
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

  useEffect(() => {
    getCity();
  }, []);

  const [Class, setClass] = useState([]);
  const getSeatClass = async () => {
    try {
      const response = await axios.get(
        "https://express-development-3576.up.railway.app/api/v1/ticket/class"
      );
      if (response.status === 200) {
        const dataClass = response.data.data;
        setClass(dataClass);
        // console.log("response class", dataClass);
      } else {
        console.error("Error fetching seat class:", Class);
      }
    } catch (error) {
      console.error("Error fetching seat class:", error);
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

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div className="w-[400px] h-[500px] mx-auto bg-slate-100 rounded shadow-lg shadow-gray-500 px-10 pt-10 pb-8">
          <div className="space-y-4">
            <div className="space-y-2">
              {/* from destination */}
              <label className=" text-gray-500 text-xs">Dari</label>
              <div className="flex justify-between items-center">
                <div>
                  <div
                    onClick={onOpenFromModal}
                    className="font-semibold text-slate-700 cursor-pointer"
                  >
                    {fromDestination}
                  </div>
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
                    <div className="mt-5 text-slate-700 font-semibold  max-sm:text-sm max-sm:mb-3 sm:text-sm">
                      Saran Pencarian
                    </div>
                    <div className="overflow-y-scroll h-[300px] max-sm:text-xs sm:text-sm mt-2">
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

                {/* swap */}
                <button
                  type="button"
                  onClick={swapDestinations}
                  className="p-1 bg-gray-100 rounded"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* to destination */}
            <div className="space-y-2 ">
              <label className=" text-gray-500 text-xs">Ke</label>
              <div
                className="font-semibold text-slate-700 cursor-pointer"
                onClick={onOpenToModal}
              >
                {toDestination}
              </div>
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
                <div className="mt-5 text-slate-700 font-semibold max-sm:text-sm max-sm:mb-3 sm:text-sm">
                  Saran Pencarian
                </div>
                <div>
                  {" "}
                  <div className="overflow-y-scroll h-[300px] mt-2 max-sm:text-xs sm:text-sm">
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

            <div className="flex justify-between items-center pt-3">
              {/* Date Range */}
              <div className="space-y-2">
                <label className=" text-gray-500 text-xs">Berangkat</label>
                <div className="font-semibold text-slate-700">
                  {" "}
                  <DatePicker
                    selected={startDate ? new Date(startDate) : null}
                    onChange={handleDateChange}
                    dateFormat="dd MMM yyyy"
                    className="cursor-pointer bg-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2"></div>
            </div>

            <div className="flex justify-between pt-3">
              {/* Passenger Count */}
              <div>
                <label className=" text-gray-500 text-xs">Penumpang</label>
                <div
                  onClick={onOpenPassengerModal}
                  className="font-semibold text-slate-700 cursor-pointer"
                >
                  {" "}
                  {`${totalPenumpang} penumpang`}
                </div>
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
                          className="sm:w-8 sm:h-8 max-sm:w-6 max-sm:h-6 border border-slate-700 text-slate-700  cursor-pointer bg-white disabled:cursor-not-allowed"
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

              {/* Seat Class */}
              <div className="mr-10">
                <label className=" text-gray-500 text-xs">Kelas</label>
                <div
                  onClick={onOpenSeatModal}
                  className="font-semibold text-slate-700 cursor-pointer"
                >
                  {getClassName(seatClass)}
                </div>
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

            <div className="pt-20">
              <button
                type="submit"
                className="w-full py-3 text-xs  bg-slate-600  text-white font-semibold rounded-full hover:bg-slate-700 transition duration-300"
              >
                Cari Penerbangan
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
