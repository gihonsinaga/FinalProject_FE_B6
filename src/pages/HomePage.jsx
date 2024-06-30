import React, { useEffect, useRef, useState } from "react";
import "../index.css";
import Footer from "../component/Footer";
import "react-responsive-modal/styles.css";
import Nav from "../component/Nav";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import Search from "../component/Search";
import Search3 from "../component/Search3";
import BottomNav from "../component/BottomNav";
import { Toaster } from "react-hot-toast";
import ChecklistIcon from "@mui/icons-material/Checklist";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import PaymentsIcon from "@mui/icons-material/Payments";
import { useDispatch, useSelector } from "react-redux";
import {
  setFromDestination,
  setPenumpang,
  setToDestination,
} from "../redux/reducers/searchReducers";
import Modal from "react-responsive-modal";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  // -----------------------------------------------------------------------------------------

  const formRef = useRef(null);

  const handleButtonClick2 = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  // --------------------------------------------------------------------------------------- FUNCTION DESTINASI FAVORIT (API) - START

  // state Destinasi Favorit
  const [activeButton, setActiveButton] = useState();
  const [idCategory, setIdCategory] = useState();
  // console.log("activeButton", idCategory);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await axios.get(
          "https://express-development-3576.up.railway.app/api/v1/ticket/schedule/category"
        );
        if (response.status === 200) {
          const dataCategory = response.data.data;
          // console.log("response category", dataCategory);
          setActiveButton(dataCategory);
        } else {
          console.error("Error fetching seat class:", response);
        }
      } catch (error) {
        console.error("Error fetching seat class:", error);
      }
    };

    getCategory();
  }, []);

  const [recomendation, setRecomendation] = useState([]);

  useEffect(() => {
    const getCategoryFilter = async () => {
      try {
        const url = idCategory
          ? `https://express-development-3576.up.railway.app/api/v1/ticket/schedule/recomendation?category_id=${idCategory}` //filter recomendation
          : "https://express-development-3576.up.railway.app/api/v1/ticket/schedule/recomendation"; //get all recomendation

        const response = await axios.get(url);
        if (response.status === 200) {
          const dataCategoryFilter = response.data.data;
          // console.log("response category filter", dataCategoryFilter);
          setRecomendation(dataCategoryFilter);
        } else {
          console.error("Error fetching recommendations:", response);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    getCategoryFilter();
  }, [idCategory]);

  const handleButtonClick = (buttonId) => {
    setIdCategory(buttonId);
  };

  // --------------------------------------------------------------------------------------- FUNCTION DESTINASI FAVORIT (API) -- END

  const formatPrice = (price) => {
    return `IDR ${price.toLocaleString("id-ID")}`;
  };

  const getRandomImage = () => {
    const images = [
      // "assets/recomend2.svg",
      // "assets/recomend3.svg",
      // "assets/recomend5.svg",
      // "assets/recomend6.svg",
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  // ---------------------------------------------------------------------------------------
  const [openPassengerModal, setOpenPassengerModal] = useState(false);

  const navigate = useNavigate();
  const handleRecommendationClick = (e) => {
    setSelectedFlight(e);
    dispatch(setFromDestination(e?.flight?.city_arrive?.name));
    dispatch(setToDestination(e?.flight?.city_destination?.name));
    setOpenPassengerModal(true);
  };
  const onClosePassengerModal = () => setOpenPassengerModal(false);

  const {
    fromDestination,
    toDestination,
    startDate,
    fromDate,
    penumpang,
    totalPenumpang,
    seatClass,
  } = useSelector((state) => state.search);
  // console.log("penumpang", penumpang);
  // console.log("total penumpang", totalPenumpang);
  const dispatch = useDispatch();
  // console.log("fromDestination", fromDestination);
  // console.log("toDestination", toDestination);

  const handleOption = (name, operation) => {
    const updatedPenumpang = {
      ...penumpang,
      [name]: operation === "i" ? penumpang[name] + 1 : penumpang[name] - 1,
    };
    dispatch(setPenumpang(updatedPenumpang));
  };
  const [selectedFlight, setSelectedFlight] = useState(null);
  // let cityArrive = selectedFlight?.flight?.city_arrive?.name;
  // let cityDestination = selectedFlight?.flight?.city_destination?.name;
  // console.log("selectedFlight", cityArrive);

  const handleCheckout = async () => {
    const data = {
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
    // console.log("data", data);
    axios
      .post(
        "https://express-development-3576.up.railway.app/api/v1/ticket/schedule?page=1",
        data
      )
      .then((response) => {
        let dataSearch = {
          data: response.data.data,
          penumpang1: totalPenumpang,
          seat_class: seatClass,
          penumpang2: penumpang,
        };
        // console.log("dataSearch", dataSearch);

        setTimeout(() => {
          navigate("/searchresult", { state: dataSearch });
        }, 2000);
      })
      .catch((error) => {
        // console.log("error", error);
      });

    onClosePassengerModal();
  };

  return (
    <div className="font-poppins ">
      <div className="text-xs">
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>

      <div className="bg-home-bg h-[670px] w-full bg-cover sm:bg-bottom max-sm:h-[600px] max-sm:bg-top">
        <Nav isHomePage={true} />
        <div className="container flex flex-col justify-center p-6 mx-auto sm:py-12 sm:px-40 lg:py-20 lg:flex-row lg:justify-between">
          <h1 className="text-white mt-24 max-sm:text-center">
            <span className="tracking-wide font-bold sm:text-5xl max-sm:text-2xl">
              Dreams To <span className="text-slate-400">Fly</span> With Us{" "}
              <span className="text-slate-300">Now</span>
            </span>
            <p className="tracking-wider sm:text-base sm:mt-5 max-sm:mt-2 font-light sm:w-[400px] max-sm:px-5 max-sm:text-xs">
              Start your journey with us by exploring this website
            </p>
            <button
              onClick={handleButtonClick2}
              className="tracking-wider sm:text-xs sm:mt-5 max-sm:mt-3 font-medium bg-gray-500 bg-opacity-70 rounded-2xl py-3 px-9 max-sm:text-[10px]"
            >
              Get Started
            </button>
          </h1>
        </div>
      </div>

      <div className=" sm:text-xl  font-extrabold tracking-wide sm:ml-20 mt-7 max-sm:px-5 sm:hidden text-center mb-5">
        Pilih Jadwal Penerbangan spesial di{" "}
        <span className="text-slate-500 ml-1"> FlyNow !</span>
      </div>

      {/* search feature */}
      <div className=" sm:hidden">
        <Search />
      </div>

      <div ref={formRef}></div>
      {/* DESTINASI FAVORIT */}
      <div className="sm:mt-16 max-sm:mt-20 sm:ml-32 sm:mb-5 max-sm:mb-8 max-sm:hidden">
        <h1 className="max-sm:text-lg sm:text-2xl  font-bold tracking-wide leading-9 text-black max-sm:text-center">
          Destinasi Favorit
        </h1>
      </div>

      {/* BUTTON dekstop*/}
      <div className=" items-center sm:ml-32 ">
        <div className="flex max-sm:overflow-x-scroll max-sm:w-[full] max-sm:mx-5 max-sm:mt-20 max-sm:hidden">
          <button
            onClick={() => handleButtonClick(null)}
            className={`flex items-center ${
              idCategory === null
                ? "bg-slate-500 text-white"
                : "bg-slate-200 text-black"
            } rounded-2xl max-sm:py-3 sm:py-3 sm:px-6 font-normal tracking-wide sm:text-xs max-sm:text-xs mr-4 max-sm:px-10`}
          >
            <img
              src="/assets/fi_search.png"
              alt=""
              className={`mr-2 w-[16px] max-sm:hidden ${
                idCategory === null ? "filter invert-0" : "filter invert"
              }`}
            />
            Semua
          </button>

          {activeButton?.map((button) => (
            <button
              key={button?.id}
              onClick={() => handleButtonClick(button?.id)}
              className={`flex items-center ${
                idCategory === button?.id
                  ? "bg-slate-500 text-white"
                  : "bg-slate-200 text-black"
              } rounded-2xl max-sm:py-3 sm:py-3 sm:px-6 font-normal tracking-wide sm:text-xs max-sm:text-xs mr-4 max-sm:px-10`}
            >
              <img
                src="/assets/fi_search.png"
                alt=""
                className={`mr-2 w-[16px] max-sm:hidden ${
                  idCategory === button?.id
                    ? "filter invert-0"
                    : "filter invert"
                }`}
              />
              {button?.city_destination}
            </button>
          ))}
        </div>

        <div className="border-gray-300 border-b-2 my-3 sm:hidden mx-36 max-sm:mt-8 "></div>
        <div className="sm:mt-24 max-sm:mt-2 sm:ml-32 sm:mb-8 sm:hidden">
          <h1 className="max-sm:text-lg sm:text-2xl sm:font-extrabold max-sm:font-bold tracking-tight leading-9 text-black max-sm:text-center">
            Destinasi Favorit
          </h1>
        </div>

        {/* button mobile */}
        <div className="flex max-sm:overflow-x-scroll max-sm:w-[full] max-sm:mx-5 max-sm:mt-5 sm:hidden">
          <button
            onClick={() => handleButtonClick(null)}
            className={`flex items-center ${
              idCategory === null
                ? "bg-slate-500 text-white"
                : "bg-slate-200 text-black"
            } rounded-2xl max-sm:py-3 sm:py-3 sm:px-6 font-normal tracking-wide sm:text-sm max-sm:text-[10px] mr-4 max-sm:px-3`}
          >
            <img
              src="/assets/fi_search.png"
              alt=""
              className={`mr-2 w-[16px] max-sm:hidden ${
                idCategory === null ? "filter invert-0" : "filter invert"
              }`}
            />
            Semua
          </button>

          {activeButton?.map((button) => (
            <button
              key={button?.id}
              onClick={() => handleButtonClick(button?.id)}
              className={`flex items-center ${
                idCategory === button?.id
                  ? "bg-slate-500 text-white"
                  : "bg-slate-200 text-black"
              } rounded-2xl max-sm:py-2 sm:py-3 sm:px-6 font-normal tracking-wide sm:text-sm max-sm:text-[10px] mr-4 max-sm:px-3`}
            >
              <img
                src="/assets/fi_search.png"
                alt=""
                className={`mr-2 w-[16px] max-sm:hidden ${
                  activeButton === button?.city_destination
                    ? "filter invert-0"
                    : "filter invert"
                }`}
              />
              {button?.city_destination}
            </button>
          ))}
        </div>

        {/* API CALL */}
        <div className="sm:flex sm:justify-between">
          <div className="sm:w-2/3">
            <div className="max-sm:flex-wrap sm:grid sm:grid-cols-3 sm:overflow-y-scroll sm:h-[500px] sm:w-[full] sm:pr-10 sm:gap-y-5 max-sm:flex sm:mt-10 max-sm:mt-10 mb-5  max-sm:gap-2 sm:gap-x-8  max-sm:mx-5 max-sm:mb-10  ">
              {recomendation?.slice(0, 6).map((e, i) => (
                <div
                  key={i}
                  onClick={() => handleRecommendationClick(e)}
                  className="max-sm:w-[48%] bg-slate-100 max-sm:h-[200px] max-sm:border max-sm:shadow-md max-sm:rounded-lg max-sm:overflow-hidden  sm:w-[full]  sm:h-[290px]  max-sm:mb-5 max-sm:justify-center max-sm:flex  border-2  shadow-xl cursor-pointer rounded-lg transition duration-300 ease-in-out transform hover:scale-105 "
                >
                  <div className="sm:mx-3 ">
                    <div>
                      <img
                        // src={getRandomImage()}
                        alt=""
                        className="sm:w-[250px] sm:h-[200px] max-sm:w-[200px] max-sm:object-cover"
                      />
                    </div>
                    <div className="sm:text-xs font-medium max-sm:text-[10px] max-sm:mt-2 max-sm:mx-2">
                      {e?.flight?.city_arrive?.name}{" "}
                      <span className="sm:text-[10px] text-blue-500 max-sm:text-[8px]">
                        ({e?.flight?.city_arrive?.code})
                      </span>{" "}
                      <span>{"➜"}</span> {e?.flight?.city_destination?.name}{" "}
                      <span className="sm:text-[10px] text-blue-500 max-sm:text-[8px]">
                        ({e?.flight?.city_destination?.code})
                      </span>{" "}
                    </div>

                    <div className="text-blue-500 sm:text-[10px] mt-2 font-bold max-sm:text-[10px] max-sm:mx-2">
                      {/* {e?.detailPlaneId?.plane?.name.split(" ")[0]} */}
                      {e?.detailPlaneId?.plane?.name}
                    </div>

                    <div className="sm:text-[12px] sm:flex font-medium max-sm:text-[10px] max-sm:mx-2">
                      mulai dari{" "}
                      <div className="text-red-500 font-bold sm:ml-1">
                        {formatPrice(e?.price)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            {" "}
            <div className="max-sm:hidden sm:mx-14 sm:mt-12 ">
              <div className="  sm:mb-8 sm:-mt-20 max-sm:hidden">
                <h1 className="max-sm:text-lg  sm:text-2xl  font-bold tracking-wide leading-9 text-black text-center">
                  Pilih Penerbangan
                </h1>
              </div>
              <div className="">
                <Search3 />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* modal */}
      <Modal open={openPassengerModal} onClose={onClosePassengerModal} center>
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
                className="sm:w-8 sm:h-8 max-sm:w-6 max-sm:h-6 border border-slate-700 text-slate-700 cursor-pointer bg-white disabled:cursor-not-allowed"
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
        </div>

        {/* <div>
          <h2 className="max-sm:text-sm sm:text-sm">Pilih Kelas Bangku</h2>
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
        </div>

        <div className="font-semibold text-slate-700">
          {" "}
          <DatePicker
            selected={startDate ? new Date(startDate) : null}
            onChange={handleDateChange}
            dateFormat="dd MMM yyyy"
            className="cursor-pointer bg-transparent"
          />
        </div> */}

        <button
          type="button"
          onClick={handleCheckout}
          className="mt-4 py-2 sm:ml-72 px-10 bg-slate-700 text-white max-sm:text-xs sm:text-xs"
        >
          Pergi
        </button>
      </Modal>

      {/* HOW IT WORKS */}
      <div className=" bg-gradient-to-r  from-blue-50 to-slate-50 sm:mt-16">
        <div className="container flex flex-col justify-center p-6 mx-auto sm:py-12 sm:px-40 lg:py-20 lg:flex-row lg:justify-between">
          <div className="max-sm:hidden flex items-center justify-center  mt-8 lg:mt-20 h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128">
            {/* <iframe
              src="https://lottie.host/embed/f6bf1d85-34f2-4af4-bb5a-a7323250d52a/LcFO5h4OoL.json"
              className="w-[500px] h-[500px] max-sm:hidden"
            ></iframe> */}
            {/* <iframe
              className="w-[500px] h-[500px] max-sm:hidden"
              src="https://lottie.host/embed/88e69f6f-7448-4732-af03-1a79b41f4935/5ZThmBYF9X.json"
            ></iframe> */}
            <iframe
              className="w-[600px] h-[700px] max-sm:hidden sm:-mt-14"
              src="https://lottie.host/embed/1054ed50-1a31-4569-9c9a-9ae7f09c68e7/en89bcTX6O.json"
            ></iframe>
          </div>
          <div className="flex flex-col justify-center text-black  p-6 text-center rounded-sm lg:max-w-md xl:max-w-lg lg:text-left">
            <h1 className="max-sm:text-xl max-sm:mt-10  font-semibold leading-none sm:text-3xl tracking-wide  max-sm:hidden">
              Bagaimana itu bekerja ?
            </h1>
            <table className="mt-2">
              <tbody>
                <tr className="font-extralight items-start text-base ">
                  <td className=" pr-3 sm:text-lg max-sm:text-base font-normal max-sm:hidden">
                    <ChecklistIcon />
                  </td>
                  <td className="pl-3 pt-6 ">
                    <span className="font-bold tracking-wide sm:text-lg">
                      Cari Tujuan Anda
                    </span>
                    <br />
                    <span className="font-normal sm:text-sm tracking-wide max-sm:text-xs">
                      {" "}
                      Pastikan untuk memasukkan dan mencari tujuan berdasarkan
                      Kota, tanggal, jumlah penumpang, dan Kelas yang anda
                      inginkan{" "}
                    </span>
                  </td>
                </tr>

                <tr className="font-extralight  items-start text-base ">
                  <td className="mb-6 pr-3  sm:text-lg max-sm:text-base font-normal max-sm:hidden">
                    <AirplaneTicketIcon />
                  </td>
                  <td className="pl-3 pt-6">
                    {" "}
                    <span className="font-bold tracking-wide sm:text-lg">
                      {" "}
                      Pilih Penerbangan
                    </span>
                    <br />{" "}
                    <span className="font-normal sm:text-sm tracking-wide max-sm:text-xs">
                      Pada halaman berikutnya, Pilih penerbangan yang paling
                      sesuai berdasarkan kebutuhan yang kamu perlukan
                    </span>
                  </td>
                </tr>
                <tr className="font-extralight  items-start text-base ">
                  <td className="mb-6 pr-3 sm:text-lg max-sm:text-base font-normal max-sm:hidden">
                    <PaymentsIcon />
                  </td>
                  <td className="pl-3 pt-6">
                    {" "}
                    <span className="font-bold tracking-wide sm:text-lg">
                      {" "}
                      Pembayaran{" "}
                    </span>
                    <br />
                    <span className="font-normal sm:text-sm tracking-wide max-sm:text-xs">
                      {" "}
                      Lakukan Pembayaran setelah checkout tiket yang Anda pilih
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* WHY CHOOSE US  */}
      <div className="sm:mt-28 sm:mb-20 mx-4 sm:px-28 max-sm:mt-10 ">
        <div className="border-gray-300 border-b-2 my-3 sm:hidden mx-36 max-sm:mt-8 "></div>

        <div className="flex font-bold sm:mb-10 sm:text-3xl sm:mt-10 justify-center text-black max-sm:text-xl">
          Mengapa Memilih Kami ?
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-3 gap-5 max-sm:grid-cols-1 max-md:grid-cols-2 mx-5 max-sm:text-sm ">
            <div className="border-2 rounded-3xl sm:px-10 sm:py-7 max-sm:px-3 max-sm:py-4  border-slate-400 max-sm:text-center">
              <div>
                <img
                  src="/assets/WhyUs1.png"
                  width="60px"
                  height="65px"
                  alt=""
                  className="max-sm:w-[40px] max-sm:mx-auto"
                />
              </div>
              <div className="font-bold sm:mt-7 max-sm:mt-2 mb-1 sm:text-base text-black tracking-wide max-sm:text-sm">
                Terjangkau
              </div>
              <div className="sm:text-sm text-black max-sm:text-xs">
                Kami menyediakan berbagai macam harga, termasuk yang paling
                murah
              </div>
            </div>

            <div className="border-2 rounded-3xl sm:px-10 sm:py-7 max-sm:px-3 max-sm:py-4 border-slate-400 max-sm:text-center">
              <div>
                <img
                  src="/assets/WhyUs2.png"
                  width="60px"
                  height="65px"
                  alt=""
                  className="max-sm:w-[40px] max-sm:mx-auto"
                />
              </div>
              <div className="font-bold sm:mt-7 max-sm:mt-2 mb-1 sm:text-base text-black tracking-wide max-sm:text-sm">
                Efisien
              </div>
              <div className="sm:text-sm text-black max-sm:text-xs">
                Kami dapat mengantarkan kebutuhan Anda lebih cepat{" "}
              </div>
            </div>

            <div className="border-2 rounded-3xl sm:px-10 sm:py-7 max-sm:px-3 max-sm:py-4 border-slate-400 max-sm:text-center">
              <div>
                <img
                  src="/assets/WhyUs3.png"
                  width="60px"
                  height="65px"
                  alt=""
                  className="max-sm:w-[40px] max-sm:mx-auto"
                />
              </div>
              <div className="font-bold sm:mt-7 max-sm:mt-2 mb-1 sm:text-base text-black tracking-wide max-sm:text-sm">
                Kesetiaan pelanggan
              </div>
              <div className="sm:text-sm text-black max-sm:text-xs">
                Selalu memberikan layanan #1 untuk pelanggan{" "}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-sm:mt-10 max-sm:mb-7">
        <div>
          <Footer />
        </div>
        <div className="sm:hidden ">
          <BottomNav />
        </div>
      </div>
      {/* end */}
    </div>
  );
}
