import React, { useEffect, useState } from "react";
import "../index.css";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "../component/Nav";
import Footer from "../component/Footer";
import Search from "../component/Search";
import "react-responsive-modal/styles.css";
import Modal from "react-modal";
import { Modal as Modal2 } from "react-responsive-modal";
import { DetailTicket } from "../redux/actions/ticketActions";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import CurrencyInput from "react-currency-input-field";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Search2 from "../component/Search2";

export default function SearchResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!location.state) {
      alert("Silahkan cari tiket terlebih dahulu");
      navigate("/");
    }
  }, [location, navigate]);

  if (!location.state) {
    // Return null or a loading spinner to avoid rendering the rest of the component
    return null;
  }

  // Tempat menampung data dari componen search
  const {
    data: initialData,
    penumpang1,
    seat_class,
    penumpang2,
  } = location.state;
  // console.log("location.state", location.state);
  const [isEmpty, setIsEmpty] = useState(false);

  //---------------------------------------------------------

  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setData(initialData);
  }, [location.state]);

  //---------------------------------------------------------
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
    if (data.length === 0) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  }, [data]);
  // console.log("data", location.state);

  // let penumpangSearch = {
  //   adult: penumpang.adult,
  //   children: penumpang.children,
  //   baby: penumpang.baby,
  // };

  // console.log("penumpangSearch", penumpangSearch);

  // --------------------------------------------------------------------------
  // fungsi button filter tanggal (opsional)

  const [selectedDate, setSelectedDate] = useState("");
  // console.log("selectedDate", selectedDate);
  const [dates, setDates] = useState([]);
  // console.log("dates", dates);

  const [fixedDateRange, setFixedDateRange] = useState([]);

  useEffect(() => {
    if (data && data.length > 0 && fixedDateRange.length === 0) {
      const flightDate = data[0].date_flight;
      const startDate = new Date(flightDate.split("-").reverse().join("-"));
      const weekDates = [];

      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const formattedDate = `${currentDate
          .getDate()
          .toString()
          .padStart(2, "0")}-${(currentDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${currentDate.getFullYear()}`;
        weekDates.push(formattedDate);
      }

      setFixedDateRange(weekDates);
      if (!selectedDate) {
        setSelectedDate(weekDates[0]);
        fetchFlightData(weekDates[0]);
      }
    }
  }, [data, fixedDateRange, selectedDate]);

  const handleDateChange = (date) => {
    if (date !== selectedDate) {
      setSelectedDate(date);
      fetchFlightData(date);
    }
  };

  // --------------------------------------------------------------------------

  const convertMinutesToHoursAndMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatPrice = (price) => {
    return `IDR ${price.toLocaleString("id-ID")}`;
  };

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    const date = new Date(`${year}-${month}-${day}`);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const [openIndex1, setOpenIndex1] = useState(null);

  const handleToggle1 = (index) => {
    setOpenIndex1(openIndex1 === index ? null : index);
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "95%",
      height: "100%",
      maxWidth: "1350px",
      maxHeight: "60vh",
      background: "white",
      border: "none",
      padding: "20px",
      borderRadius: "1rem",
      overflow: "auto",
    },
  };

  Modal.setAppElement("#root");

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  // ---------------------------------------------------------------------------

  const { fromDestination, toDestination, fromDate, penumpang, seatClass } =
    useSelector((state) => state.search);

  // -------------------------------------------------------------------------------------

  // pagination api
  let dataPagination = {
    city_arrive_id: fromDestination,
    city_destination_id: toDestination,
    date_departure: selectedDate,
    seat_class: seatClass,
    passenger: {
      adult: penumpang.adult,
      children: penumpang.children,
    },
    sorting: {
      sortAsc: true,
      price_from: 0,
      price_to: 10000000000,
    },
  };
  const handlePagination = (page) => {
    setIsLoading(true);
    axios
      .post(
        `https://express-development-3576.up.railway.app/api/v1/ticket/schedule?page=${page}`,
        dataPagination
      )
      .then((response) => {
        setData(response.data.data);
        console.log("data tiket", data);
        setCurrentPage(page);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
        toast.error("Data Tidak Tersedia, Coba cari yang lain");
        setIsLoading(false);
      });
  };

  // -------------------------------------------------------------------------------------

  // modal filter price
  const [priceFrom, setPriceFrom] = useState(0);
  const [priceTo, setPriceTo] = useState(200000000);

  const [openFilterPrice, setOpenFilterPrice] = useState(false);
  const onOpenFilterPriceModal = () => setOpenFilterPrice(true);
  const onCloseFilterPriceModal = () => setOpenFilterPrice(false);

  const handleSavePrices = () => {
    handleFilterPrice(1);
    onCloseFilterPriceModal();
  };

  // filter price api
  let filterPrice = {
    city_arrive_id: fromDestination,
    city_destination_id: toDestination,
    date_departure: selectedDate,
    seat_class: seatClass,
    passenger: {
      adult: penumpang.adult,
      children: penumpang.children,
    },
    sorting: {
      sortAsc: true,
      price_from: priceFrom,
      price_to: priceTo,
    },
  };

  const handleFilterPrice = (page) => {
    setIsLoading(true);
    axios
      .post(
        `https://express-development-3576.up.railway.app/api/v1/ticket/schedule?page=${page}`,
        filterPrice
      )
      .then((response) => {
        setData(response.data.data);
        console.log("data tiket", data);
        setCurrentPage(page);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
        toast.error("Data Tidak Tersedia, Coba cari yang lain");
        setIsLoading(false);
      });
  };

  // -------------------------------------------------------------------------------------

  // modal filter time
  const [timeFrom, setTimeFrom] = useState("00:00");
  const [timeTo, setTimeTo] = useState("24:00");

  const [openFilterTime, setOpenFilterTime] = useState(false);
  const onOpenFilterTimeModal = () => setOpenFilterTime(true);
  const onCloseFilterTimeModal = () => setOpenFilterTime(false);

  const formatTime = (value) => {
    // Hapus semua karakter non-digit
    const digits = value.replace(/\D/g, "");

    // Pastikan panjang string tidak lebih dari 4 digit
    const trimmed = digits.slice(0, 4);

    // Tambahkan ":" setelah 2 digit pertama jika ada
    if (trimmed.length > 2) {
      return `${trimmed.slice(0, 2)}:${trimmed.slice(2)}`;
    } else if (trimmed.length === 2) {
      return `${trimmed}:`;
    }

    return trimmed;
  };

  const handleTimeFromChange = (e) => {
    const formattedValue = formatTime(e.target.value);
    setTimeFrom(formattedValue);
  };

  const handleTimeToChange = (e) => {
    const formattedValue = formatTime(e.target.value);
    setTimeTo(formattedValue);
  };

  const handleSaveTime = () => {
    handleFilterTime(1);
    onCloseFilterTimeModal();
  };

  // filter time api
  let filterTime = {
    city_arrive_id: fromDestination,
    city_destination_id: toDestination,
    date_departure: selectedDate,
    seat_class: seatClass,
    passenger: {
      adult: penumpang.adult,
      children: penumpang.children,
    },
    sorting: {
      sortAsc: true,
      time_departure_from: timeFrom,
      time_departure_to: timeTo,
    },
  };

  const handleFilterTime = (page) => {
    setIsLoading(true);
    axios
      .post(
        `https://express-development-3576.up.railway.app/api/v1/ticket/schedule?page=${page}`,
        filterTime
      )
      .then((response) => {
        setData(response.data.data);
        console.log("data tiket", data);
        setCurrentPage(page);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
        toast.error("Data Tidak Tersedia, Coba cari yang lain");
        setIsLoading(false);
      });
  };

  // --------------------------------------------------------------------------
  // fetching untuk button tanggal dibawah ubah pencarian

  const fetchFlightData = (date) => {
    setIsLoading(true);
    let dataa = {
      city_arrive_id: fromDestination,
      city_destination_id: toDestination,
      date_departure: date,
      seat_class: seatClass,
      passenger: {
        adult: penumpang.adult,
        children: penumpang.children,
      },
      sorting: {
        sortAsc: true,
        price_from: priceFrom,
        price_to: priceTo,
        time_departure_from: "//",
        time_departure_to: "//",
      },
    };

    axios
      .post(
        `https://express-development-3576.up.railway.app/api/v1/ticket/schedule?page=1`,
        dataa
      )
      .then((response) => {
        setData(response.data.data);
        console.log("data tiket", response.data.data);
        setCurrentPage(1);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
        toast.error("Data Tidak Tersedia, Coba cari yang lain");
        setIsLoading(false);
      });
  };

  // -----------------------------------------------------------------------------

  const [sortAsc, setSortAsc] = useState(true);

  // sorting price termurah
  let sortingPrice = {
    city_arrive_id: fromDestination,
    city_destination_id: toDestination,
    date_departure: selectedDate,
    seat_class: seatClass,
    passenger: {
      adult: penumpang.adult,
      children: penumpang.children,
    },
    sorting: {
      sortAsc: sortAsc,
      price_from: priceFrom,
      price_to: priceTo,
    },
  };
  // console.log("sortingPrice", sortingPrice);

  const handleSortingPrice = () => {
    setIsLoading(true);
    setSortAsc(!sortAsc); // Ubah nilai sortAsc setiap kali tombol diklik

    axios
      .post(
        `https://express-development-3576.up.railway.app/api/v1/ticket/schedule?page=1`,
        sortingPrice
      )
      .then((response) => {
        setData(response.data.data);
        console.log("data tiket", data);
        setCurrentPage(1);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
        toast.error("Data Tidak Tersedia, Coba cari yang lain");
        setIsLoading(false);
      });
  };

  // -----------------------------------------------------------------------------

  // -----------------------------------------------------------------------------

  const [sortAsc2, setSortAsc2] = useState(true);

  // sorting price termurah
  let sortingTime = {
    city_arrive_id: fromDestination,
    city_destination_id: toDestination,
    date_departure: selectedDate,
    seat_class: seatClass,
    passenger: {
      adult: penumpang.adult,
      children: penumpang.children,
    },
    sorting: {
      sortAsc: sortAsc2,
      time_departure_from: timeFrom,
      time_departure_to: timeTo,
    },
  };
  // console.log("sortingPrice", sortingPrice);

  const handleSortingTime = () => {
    setIsLoading(true);
    setSortAsc2(!sortAsc2); // Ubah nilai sortAsc setiap kali tombol diklik

    axios
      .post(
        `https://express-development-3576.up.railway.app/api/v1/ticket/schedule?page=1`,
        sortingTime
      )
      .then((response) => {
        setData(response.data.data);
        console.log("data tiket", data);
        setCurrentPage(1);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
        toast.error("Data Tidak Tersedia, Coba cari yang lain");
        setIsLoading(false);
      });
  };

  // -----------------------------------------------------------------------------
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  //------------------------------------------------------------------------------
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);

  const toggleDropdown2 = () => {
    setDropdownIsOpen(!dropdownIsOpen);
  };

  return (
    <div className=" max-sm:text-sm">
      <div className="text-xs">
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
      <div className=" max-sm:h-[50px] ">
        <Nav isHomePage={false} />
        {/* <div className="container flex flex-col justify-center p-6 sm:py-12 sm:px-40 lg:py-20 lg:flex-row lg:justify-between"></div> */}
      </div>

      {/* header beranda ubah pencarian */}
      <div className="flex flex-col mx-auto sm:px-40 max-sm:mt-3 sm:mt-20">
        <div className="flex justify-between ">
          <div className="flex sm:mt-10  font-semibold items-center sm:p-4 max-sm:p-2  bg-slate-500 sm:w-[1350px]  text-white  max-sm:w-full">
            <div className="flex sm:text-base">
              <div className="sm:mr-7 max-sm:mr-3">
                <button
                  onClick={() => navigate("/")}
                  className="max-sm:mt-1  max-sm:text-xs"
                >
                  ←
                </button>
              </div>
              {data.map((data, i) => {
                if (i === 0) {
                  return (
                    <div
                      className="max-sm:ml-2 sm:flex max-sm:text-[10px]"
                      key={i}
                    >
                      {data?.city_destination?.code} {">"}{" "}
                      {data?.city_arive?.code}
                      <span className="max-sm:hidden sm:mx-1"> - </span>
                      <div className="max-sm:text-[10px] max-sm:-mt-1">
                        {" "}
                        {penumpang1} Penumpang - {getClassName(seat_class)}{" "}
                      </div>
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          </div>
          {/* button ubah mobile */}
          <button
            onClick={openModal}
            className=" bg-white border-slate-600 border-t border-b border-r font-semibold text-slate-600 text-[10px]  h-[full] w-[full] px-4 sm:hidden "
          >
            Ubah
          </button>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            contentLabel="Search Modal"
          >
            <div className="relative  bg-white w-full h-full overflow-auto">
              <div className="flex justify-between sm:text-3xl sm:mt-10 sm:px-10 font-extrabold max-sm:mb-2 text-slate-600 ">
                <div className="sm:text-2xl ">Ubah Jadwal Penerbangan </div>
                <div
                  className="text-black cursor-pointer mt-1 "
                  onClick={closeModal}
                >
                  <img
                    src="assets/closeModal2.png"
                    className="sm:w-[20px]"
                    alt=""
                  />
                </div>
              </div>

              <Search />
            </div>
          </Modal>

          {/* button ubah dekstop */}
          <div className="relative">
            <button
              onClick={toggleDropdown2}
              className="bg-white border-slate-600 border font-semibold text-slate-600 mt-10 py-5 px-16 max-sm:hidden sm:text-base"
            >
              Ubah
            </button>

            {dropdownIsOpen && (
              <div className="absolute right-0 top-full w-[1200px] mt-3 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                <Search2 />
              </div>
            )}
          </div>
        </div>

        {/* button filter tanggal */}
        <div className="flex max-sm:flex-row max-sm:items-center max-sm:justify-start max-sm:space-x-4 sm:justify-around sm:p-4 mt-3 max-sm:overflow-x-scroll max-sm:w-[full]">
          {fixedDateRange.map((date) => {
            const [day, month, year] = date.split("-");

            const dateObj = new Date(`${year}-${month}-${day}`);

            return (
              <div
                key={date}
                className={`sm:p-2 text-center cursor-pointer max-sm:px-5 max-sm:ml-2 max-sm:flex-shrink-0 ${
                  date === selectedDate
                    ? "border-slate-900 border-l border-r text-slate-600 font-bold sm:px-7 italic "
                    : ""
                }`}
                onClick={() => handleDateChange(date)}
              >
                <div className="">
                  <div className="sm:text-xs  max-sm:text-[10px]">
                    {dateObj.toLocaleDateString("id-ID", {
                      weekday: "long",
                    })}
                  </div>
                  <div className="sm:text-[12px] max-sm:text-[10px] max-sm:-mt-1">
                    {formatDate(date)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-gray-300 border-b-2 mb-1 mt-1 px-40 max-sm:mt-2 max-sm:hidden"></div>

        {/* filter card kiri */}
        <div className="sm:flex justify-between mt-10 max-sm:mx-3 max-sm:text-sm">
          <div>
            {/* filter fitur */}
            <div className="p-4 h-[200px] sm:w-[300px] max-sm:w-[full] rounded-xl shadow-xl border max-sm:mb-5 max-sm:hidden sm:text-sm bg-slate-50">
              <h3 className="font-semibold text-gray-600 mb-5 tracking-wide ml-2 sm:text-lg text-center max-sm:text-base ">
                Filter
              </h3>
              <div
                onClick={onOpenFilterTimeModal}
                className="flex justify-between py-2 cursor-pointer border-b-2 mb-4 pb-3 transform transition-transform duration-300 hover:scale-95"
              >
                <div className="flex pl-2">
                  <img
                    src="assets/time.png"
                    className="sm:w-[19px] sm:h-[19px] max-sm:w-[17px] max-sm:h-[17px]"
                    alt=""
                  />
                  <div className="pl-2">Jam</div>
                </div>
                <div>
                  <img
                    src="assets/fi_chevron-right.png"
                    className="max-sm:w-[17px] max-sm:h-[17px]"
                    alt=""
                  />
                </div>
              </div>
              <Modal2
                open={openFilterTime}
                onClose={onCloseFilterTimeModal}
                center
              >
                <h2 className="text-center max-sm:text-sm max-sm:mt-8">
                  Masukkan rentang Waktu
                </h2>
                <div className="sm:flex mt-5 text-sm">
                  <div className="flex flex-col">
                    <input
                      type="text"
                      id="timeFrom"
                      value={timeFrom}
                      onChange={handleTimeFromChange}
                      placeholder="HH:MM"
                      pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
                      className="border p-2 text-gray-500"
                    />
                  </div>
                  <div className="text-2xl text-gray-400 mx-4 mt-1">-</div>
                  <div className="flex flex-col">
                    <input
                      type="text"
                      id="timeTo"
                      value={timeTo}
                      onChange={handleTimeToChange}
                      placeholder="HH:MM"
                      pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
                      className="border p-2 text-gray-500"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSaveTime}
                  type="button"
                  className="mt-4 p-2 px-5 bg-slate-500 text-white sm:ml-80 sm:text-sm max-sm:text-xs"
                >
                  Simpan
                </button>
              </Modal2>
              <div
                onClick={onOpenFilterPriceModal}
                className="flex justify-between py-2 cursor-pointer transform transition-transform duration-300 hover:scale-95"
              >
                <div className="flex pl-2">
                  <img
                    src="assets/fi_dollar-sign.png"
                    className="max-sm:w-[17px] max-sm:h-[17px] sm:w-[19px] sm:h-[19px]"
                    alt=""
                  />
                  <div className="pl-2">Harga</div>
                </div>
                <div>
                  <img
                    src="assets/fi_chevron-right.png"
                    className="max-sm:w-[17px] max-sm:h-[17px]"
                    alt=""
                  />
                </div>
              </div>
              <Modal2
                open={openFilterPrice}
                onClose={onCloseFilterPriceModal}
                center
              >
                <h2 className="text-center max-sm:text-sm max-sm:mt-8">
                  Masukkan rentang harga
                </h2>
                <div className="sm:flex mt-5 text-sm">
                  <div className="flex flex-col">
                    <CurrencyInput
                      id="priceFrom"
                      name="priceFrom"
                      value={priceFrom}
                      decimalsLimit={0}
                      onValueChange={(value) => setPriceFrom(value)}
                      prefix="IDR "
                      className="border p-2 text-gray-500"
                    />
                  </div>{" "}
                  <div className="text-2xl text-gray-400 mx-4 mt-1">-</div>
                  <div className="flex flex-col">
                    <CurrencyInput
                      id="priceTo"
                      name="priceTo"
                      value={priceTo}
                      decimalsLimit={0}
                      onValueChange={(value) => setPriceTo(value)}
                      prefix="IDR "
                      className="border p-2 text-gray-500"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSavePrices}
                  className="mt-4 p-2 px-5 bg-slate-500 text-white sm:ml-80 sm:text-sm max-sm:text-xs"
                >
                  Simpan
                </button>
              </Modal2>
            </div>

            {/* sorting fitur*/}
            <div className="p-4 h-[130px] sm:w-[300px] max-sm:w-[full] rounded-xl shadow-xl border max-sm:mb-5 max-sm:hidden sm:text-sm mt-10 bg-slate-50">
              <div
                onClick={handleSortingPrice}
                className="flex justify-between py-2 cursor-pointer border-b-2 mb-4 pb-3 transform transition-transform duration-300 hover:scale-95"
              >
                <div className="flex pl-3">
                  ⇅ <span className="ml-4">Harga</span>
                </div>
                <div>
                  {/* <img
                    src="assets/fi_chevron-right.png"
                    className="max-sm:w-[17px] max-sm:h-[17px]"
                    alt=""
                  /> */}
                </div>
              </div>

              <div
                onClick={handleSortingTime}
                className="flex justify-between py-2 cursor-pointer transform transition-transform duration-300 hover:scale-95"
              >
                <div className="flex pl-3">
                  ⇅ <span className="ml-4">Waktu</span>
                </div>
                <div>
                  {/* <img
                    src="assets/fi_chevron-right.png"
                    className="max-sm:w-[17px] max-sm:h-[17px]"
                    alt=""
                  /> */}
                </div>
              </div>
            </div>
          </div>

          <div className="border-gray-300 border-b-2 my-3 sm:hidden mx-32 max-sm:mt-2 max-sm:mb-5 "></div>

          {/* list tiket */}
          <div className="text-center overflow-y-scroll sm:h-[450px] max-sm:h-[380px] max-sm:text-xs">
            {/* booking tiket 1 */}
            {isEmpty ? (
              <div className="flex flex-col mt-10 sm:px-60">
                <img
                  src="assets/not_found.png"
                  alt="No Data"
                  className="sm:h-[250px] sm:w-[300px]"
                />
                <h2 className="sm:text-base font-semibold mt-4 max-sm:text-sm max-sm:text-center">
                  Maaf, Tiket Anda tidak ditemukan
                </h2>
                <div
                  onClick={() => navigate("/")}
                  className="text-slate-600 cursor-pointer max-sm:text-center sm:text-sm"
                >
                  Coba cari perjalanan lainnya!
                </div>
              </div>
            ) : (
              <div className="sm:px-4 space-y-4 sm:w-[850px] max-sm:w-[full] ">
                {data.map((item, i) => (
                  <div
                    key={i}
                    className="border rounded-lg sm:px-8 max-sm:px-2 py-7 sm:flex sm:flex-col justify-between items-center shadow-xl sm:text-sm bg-slate-100 "
                  >
                    <div className="sm:w-full sm:flex sm:justify-between items-center max-sm:h-[120px] ">
                      <div>
                        <div className="flex items-center space-x-2 max-sm:-mt-4">
                          <img
                            src="assets/Thumbnail.png"
                            alt="Logo"
                            className="h-6 w-6"
                          />
                          <span className="font-medium ">
                            {item?.flightplane} - {item?.flightseat}
                          </span>
                        </div>
                        <div className="flex sm:items-center space-x-4 sm:mt-5 max-sm:mt-3 sm:pl-10 max-sm:px-5 max-sm:justify-between ">
                          <div className="flex flex-col font-semibold sm:text-sm">
                            {item?.time_departure}
                            <div className="font-medium mt-1">
                              {item?.city_arive?.code}
                            </div>
                          </div>
                          <span className="text-gray-500 sm:text-xs max-sm:text-[10px]">
                            {convertMinutesToHoursAndMinutes(
                              item?.estimation_minute
                            )}
                            <div className="border-gray-300 border-b-2 mb-1 mt-1 sm:px-40 max-sm:px-16"></div>
                            <div className="sm:text-xs max-sm:text-[10px]">
                              Direct
                            </div>
                          </span>
                          <div className="flex flex-col font-semibold sm:text-sm">
                            {item?.time_arrive}
                            <div className="font-medium mt-1">
                              {item?.city_destination.code}
                            </div>
                          </div>
                          <div className="pl-7 max-sm:hidden"></div>
                        </div>
                      </div>
                      <div className="sm:text-right max-sm:mt-2">
                        <div className="flex sm:justify-end max-sm:justify-between mb-2 max-sm:px-5">
                          <div onClick={() => handleToggle1(i)}>
                            <img
                              src="assets/Suffix.png"
                              alt=""
                              className="sm:w-[20px] sm:h-[20px] max-sm:w-[20px] max-sm:h-[20px] sm:mr-3  cursor-pointer max-sm:mr-5 max-sm:ml-28 max-sm:mt-2"
                            />
                          </div>

                          <div>
                            <div className="text-red-500 font-bold sm:text-sm">
                              {formatPrice(item?.price)}
                            </div>
                            <button
                              //simpan id untuk action
                              onClick={async () => {
                                const dataTiket = await dispatch(
                                  DetailTicket({
                                    id: item?.flightdetailid,
                                    passenger: penumpang1,
                                    passenger2: penumpang2,
                                  })
                                );
                                // console.log("dataTiket", dataTiket);
                                navigate("/checkout");

                                // simpan id untuk checkout
                                // navigate("/checkout", {
                                //   state: { flightDetailId: item?.flightDetailId },
                                // });
                              }}
                              className="bg-slate-600 text-white px-7 max-sm:py-1 sm:py-2 rounded-2xl mt-2 text-xs"
                            >
                              Pilih
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {openIndex1 === i && (
                      <div className="w-full mt-4 max-sm:text-[11px] max-sm:px-2 max-sm:mt-7 sm:text-sm">
                        <div className="border-gray-300 border-b-2 my-3 "></div>
                        <div className="text-gray-700 flex flex-col text-left">
                          <div className="font-bold mb-2 sm:text-base max-sm:text-sm text-slate-700">
                            Detail Penerbangan
                          </div>
                          <div className="flex justify-between">
                            <div>
                              <div className="font-bold">
                                {item?.time_departure}
                              </div>
                              <div>{formatDate(item?.date_flight)}</div>
                              <div>{item?.city_arive?.airport_name}</div>
                              <div className="font-bold">
                                {item?.city_arive?.name}
                              </div>
                            </div>
                            <div className="mt-6 text-slate-600 font-bold">
                              Keberangkatan
                            </div>
                          </div>
                        </div>
                        <div className="border-gray-300 border-b-2 my-3"></div>
                        <div className="text-gray-700 flex flex-col text-left">
                          <div className="font-bold">
                            {item?.flightplane} - {item?.flightseat}
                          </div>
                          <div>{item?.flightnumber}</div>
                          <div className="mt-2 font-bold">Informasi :</div>
                          <div>Baggage 20 kg</div>
                          <div>Cabin baggage 7 kg</div>
                          <div>In Flight Entertainment</div>
                        </div>
                        <div className="border-gray-300 border-b-2 my-3"></div>
                        <div className="text-gray-700 flex flex-col text-left">
                          <div className="flex justify-between">
                            <div>
                              <div className="font-bold">
                                {item?.time_arrive}
                              </div>
                              <div>{formatDate(item?.date_flight)}</div>
                              <div>{item?.city_destination?.airport_name}</div>
                              <div className="font-bold">
                                {item?.city_destination?.name}
                              </div>
                            </div>
                            <div className="mt-6 text-slate-600 font-bold">
                              Kedatangan
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-gray-300 border-b-2 mb-1 sm:mt-14 px-40 max-sm:mt-3"></div>

        {/* Pagination */}

        <div className="max-sm:flex max-sm:justify-end">
          <div className="flex justify-end items-center sm:mt-5 max-sm:mr-5 max-sm:mt-2 max-sm:mb-5 ">
            <button
              disabled={currentPage === 1 || isLoading}
              onClick={() => handlePagination(currentPage - 1, "price")}
              className="sm:px-3 sm:py-1 max-sm:px-3 max-sm:py-1 bg-slate-500 text-white "
            >
              <span>{"<"}</span>
            </button>
            <span className="sm:mx-4 max-sm:mx-3 font-medium max-sm:text-xs  sm:text-xs">
              {currentPage}
            </span>
            <button
              disabled={isLoading}
              onClick={() => handlePagination(currentPage + 1, "price")}
              className="sm:px-3 sm:py-1 max-sm:px-3 max-sm:py-1 bg-slate-500 text-white "
            >
              <span>{">"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* filter mobile */}
      <div className="sm:hidden text-xs mb-12 relative">
        <div
          className="flex bg-white text-slate-600 border cursor-pointer border-slate-500 px-4 h-[40px] items-center w-full"
          onClick={toggleDropdown}
        >
          <div className="mx-auto flex">
            <div>
              <FilterAltIcon sx={{ fontSize: "18px" }} />
            </div>
            <div className="ml-1 text-sm">Filter</div>
          </div>
        </div>
        {dropdownOpen && (
          <div className="absolute bottom-12 left-0 right-0  border bg-white border-slate-500 flex flex-col items-center ">
            <div className="flex">
              <button
                onClick={onOpenFilterTimeModal}
                className="p-3 text-slate-600 font-medium"
              >
                Jam
              </button>
              <div className="mx-10"></div>
              <button
                onClick={onOpenFilterPriceModal}
                className="p-3 text-slate-600 font-medium "
              >
                Harga
              </button>
            </div>
          </div>
        )}
      </div>

      {/* sorting mobile */}
      <div className="flex fixed bottom-0 w-full justify-between px-14  sm:hidden bg-slate-500 text-xs py-3">
        <div className="">
          {" "}
          <button
            onClick={handleSortingPrice}
            className=" text-white    font-medium  duration-300  "
          >
            ⇅ <span className="ml-1">Harga</span>
          </button>
        </div>

        <div className="">
          {" "}
          <button
            onClick={handleSortingTime}
            className=" text-white  font-medium    hover:text-white duration-300  "
          >
            ⇅ <span className="ml-1">Waktu</span>
          </button>
        </div>
      </div>

      <div className="mt-20  max-sm:hidden">
        <Footer />
      </div>
    </div>
  );
}
