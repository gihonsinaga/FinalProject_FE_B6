import Footer from "../component/Footer";
import { useSelector } from "react-redux";
import axios from "axios";
import $ from "jquery";
import "datatables.net";
import "datatables.net-dt";
import "datatables.net-responsive";
import "datatables.net-responsive-dt";
import toast, { Toaster } from "react-hot-toast";
import React, { useEffect, useState, useRef } from "react";
import "../dataTablesCustom.css";
import "../index.css";
import PlaneOrderHistogram from "./PlaneOrderHistogram";
import PlanePieChart from "./PlanePieChart";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch } from "react-redux";
import {
  fetchNotifications,
  postNotification,
  updateNotificationStatus,
} from "../redux/actions/notificationAction";
import {
  BellIcon,
  CalendarIcon,
  PlusIcon,
  UsersIcon,
} from "@heroicons/react/solid";
import {
  UserCircleIcon,
  HomeIcon,
  MenuIcon,
  PaperAirplaneIcon,
  XIcon,
  CreditCardIcon,
} from "@heroicons/react/outline";
import { useNavigate } from "react-router-dom";
import Modal from "react-responsive-modal";
import { logout } from "../redux/actions/authActions";

export default function AdminPage() {
  const navigate = useNavigate();

  // total airplane
  // all cities
  // all countries
  // all continent
  // all user -> detail user
  // all notification
  const role = useSelector((state) => state.auth.role);
  useEffect(() => {
    if (role === "user") {
      alert("Anda bukan admin");
      navigate("/");
    }
  });
  // console.log("role", role);
  const navigation = [
    { name: "Dashboard", href: "/admin", icon: HomeIcon, current: false },
    {
      name: "Pengguna",
      href: "/admin/pengguna",
      icon: UsersIcon,
      current: false,
    },

    {
      name: "Pemesanan",
      href: "/admin/pemesanan",
      icon: CreditCardIcon,
      current: false,
    },
    {
      name: "Notifikasi",
      href: "/admin/notifikasi",
      icon: BellIcon,
      current: false,
    },
    {
      name: "Penerbangan",
      href: "/admin/penerbangan",
      icon: PlusIcon,
      current: true,
    },
    {
      name: "Pesawat",
      href: "/admin/pesawat",
      icon: PaperAirplaneIcon,
      current: false,
    },
  ];

  const [planes, setPlanes] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [continents, setContinents] = useState([]);

  const [userData, setUserData] = useState({
    countUser: 0,
    countOrder: 0,
    countFlight: 0,
  });

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const response = await axios.get(
          "https://express-development-3576.up.railway.app/api/v1/planes",
          {
            headers: {
              accept: "application/json",
            },
          }
        );
        setPlanes(response.data.data);
        // console.log("pesawat", response.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
      }
    };

    fetchPlanes();
  }, []);

  useEffect(() => {
    const userCount = async () => {
      try {
        const response = await axios.get(
          "https://express-development-3576.up.railway.app/api/v1/admin/count",
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data.data);
        // console.log("admin count", response.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
      }
    };

    userCount();
  }, []);

  const [postCity, setPostCity] = useState([]);

  const fetchCities = async () => {
    try {
      const response = await axios.get(
        "https://express-development-3576.up.railway.app/api/v1/cities",
        {
          headers: {
            accept: "application/json",
          },
        }
      );
      const cityNames = response.data.data.map((city) => city.name);
      const city = response.data.data;
      // console.log("city", city);
      setCities(cityNames);
      setPostCity(city);
      // console.log("City names:", cityNames);
    } catch (error) {
      // console.error("Error fetching cities:", error);
    }
  };

  const CityCard = ({ cityName }) => (
    <div className="bg-white shadow rounded-lg p-4 m-2">
      <h3 className="text-md font-medium">{cityName}</h3>
    </div>
  );

  const fetchCountries = async () => {
    try {
      const response = await axios.get(
        "https://express-development-3576.up.railway.app/api/v1/countries",
        {
          headers: {
            accept: "application/json",
          },
        }
      );
      const countriesName = response.data.data.map(
        (countries) => countries.name
      );
      setCountries(countriesName);
      // console.log("countriesName:", cities);
    } catch (error) {
      // console.error("Error fetching countries:", error);
    }
  };

  const fetchContinents = async () => {
    try {
      const response = await axios.get(
        "https://express-development-3576.up.railway.app/api/v1/continents",
        {
          headers: {
            accept: "application/json",
          },
        }
      );
      const continentsName = response.data.data.map(
        (continents) => continents.name
      );
      setContinents(continentsName);
      // console.log("continentsName", continentsName);
    } catch (error) {
      // console.error("Error fetching continents:", error);
    }
  };

  useEffect(() => {
    fetchCities();
    fetchCountries();
    fetchContinents();
  }, []);

  const uniquePlanes = new Set(planes.map((plane) => plane.name));
  const totalUniquePlanes = uniquePlanes.size;
  const stats = [
    {
      name: "Total Penerbangan",
      stat: userData.countFlight,
    },
    {
      name: "Total Kota",
      stat: cities.length,
    },
    {
      name: "Total Negara",
      stat: countries.length,
    },
    {
      name: "Total Kontinen",
      stat: continents.length,
    },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

  // ------------------------------------------------------------------

  const [cityFromId, setCityFromId] = useState(1);
  const [cityFromName, setCityFromName] = useState("Tangerang");
  const [cityDestinationId, setCityDestinationId] = useState(2);
  const [cityDestinationName, setCityDestinationName] = useState("Denpasar");
  const [timeDeparture, setTimeDeparture] = useState("12:00");
  const [timeArrive, setTimeArrive] = useState("13:30");
  const [discount, setDiscount] = useState(0);
  const [days, setDays] = useState({
    is_monday: false,
    is_thuesday: false,
    is_wednesday: false,
    is_thursday: false,
    is_friday: false,
    is_saturday: false,
    is_sunday: false,
  });
  const [category, setCategory] = useState([{ price: 0, detail_plane_id: 1 }]);

  // console.log("cityDestinationId", cityDestinationId);
  // console.log("cityFromId", cityFromId);
  // console.log("timeDeparture", timeDeparture);
  // console.log("timeArrive", timeArrive);
  // console.log("discount", discount);
  // console.log("days", days);
  // console.log("category", category);

  const [openFromModal, setOpenFromModal] = useState(false);
  const [openToModal, setOpenToModal] = useState(false);
  const onOpenFromModal = () => setOpenFromModal(true);
  const onCloseFromModal = () => setOpenFromModal(false);
  const onOpenToModal = () => setOpenToModal(true);
  const onCloseToModal = () => setOpenToModal(false);

  const onSelectCityFrom = (selectedCity) => {
    setCityFromName(selectedCity.name);
    setCityFromId(selectedCity.id);
    onCloseFromModal();
  };

  const onSelectCityTo = (selectedCity) => {
    setCityDestinationName(selectedCity.name);
    setCityDestinationId(selectedCity.id);
    onCloseToModal();
  };

  const handleTimeChange = (event) => {
    const { name, value } = event.target;
    if (name === "time_departure") {
      setTimeDeparture(value);
    } else if (name === "time_arrive") {
      setTimeArrive(value);
    }
  };

  const handleDiscountChange = (event) => {
    setDiscount(event.target.value);
  };

  const handleDayChange = (event) => {
    const { name, checked } = event.target;
    setDays((prevDays) => ({
      ...prevDays,
      [name]: checked,
    }));
  };

  const handleCategoryChange = (index, field, value) => {
    const newCategory = [...category];
    newCategory[index][field] = value;
    setCategory(newCategory);
  };

  const addCategory = () => {
    setCategory([...category, { price: 0, detail_plane_id: 1 }]);
  };

  // const token = useSelector((state) => state.auth);
  // console.log("token", token);

  const handlePostPenerbangan = async () => {
    const confirmation = window.confirm(
      "Apakah Anda yakin ingin memposting penerbangan?"
    );
    if (confirmation) {
      const requestBody = {
        time_departure: timeDeparture,
        time_arrive: timeArrive,
        city_arrive_id: cityFromId,
        city_destination_id: cityDestinationId,
        discount: parseInt(discount, 10),
        is_monday: days.is_monday,
        is_thuesday: days.is_thuesday,
        is_wednesday: days.is_wednesday,
        is_thursday: days.is_thursday,
        is_friday: days.is_friday,
        is_saturday: days.is_saturday,
        is_sunday: days.is_sunday,
        category,
      };

      try {
        const response = await axios.post(
          "https://express-development-3576.up.railway.app/api/v1/admin/flight",
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response.data);
        toast.success("Penerbangan Berhasil Ditambahkan");

        setTimeDeparture("12:00");
        setTimeArrive("13:30");
        setCityFromId(1);
        setCityFromName("Tangerang");
        setCityDestinationId(2);
        setCityDestinationName("Denpasar");
        setDiscount(0);
        setDays({
          is_monday: false,
          is_tuesday: false,
          is_wednesday: false,
          is_thursday: false,
          is_friday: false,
          is_saturday: false,
          is_sunday: false,
        });
        setCategory([]);
      } catch (error) {
        // console.error(error);
        toast.error(error.response.data.message);
        // Tangani error, seperti menampilkan pesan error kepada pengguna
      }
    }
  };

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  //- ----------------------------------------------------------------

  return (
    <div>
      <div className="text-xs">
        <Toaster position="bottom-right" />
      </div>
      <>
        <div>
          <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 flex z-40 md:hidden"
              onClose={setSidebarOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              ></Transition.Child>
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                    <div className="flex-shrink-0 flex items-center px-4">
                      <img
                        src="/assets/FlyNow.png"
                        className="h-8"
                        alt="FlyNow Logo"
                      />
                    </div>
                    <nav className="mt-5 px-2 space-y-1">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                            "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current
                                ? "text-gray-500"
                                : "text-gray-400 group-hover:text-gray-500",
                              "mr-4 flex-shrink-0 h-6 w-6"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      ))}
                    </nav>
                  </div>
                  <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                    <a href="#" className="flex-shrink-0 group block">
                      <div className="flex items-center">
                        <div>
                          <img
                            className="inline-block h-10 w-10 rounded-full"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt=""
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                            Admin
                          </p>
                          <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                            View profile
                          </p>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </Transition.Child>
              <div className="flex-shrink-0 w-14">
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </Dialog>
          </Transition.Root>

          {/* Static sidebar for desktop */}
          <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-slate-200">
              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 pl-4">
                  <div className="mr-3">
                    <img
                      src="/assets/LogoFlyNow.svg"
                      className="h-7"
                      alt="FlyNow Logo"
                    />
                  </div>
                  <div>
                    <img
                      src="/assets/FlyNow.svg"
                      className="h-7 mt-2"
                      alt="FlyNow Logo"
                    />
                  </div>
                </div>
                <div className="border-slate-300 border-b-2 mt-5  mx-4 "></div>

                <nav className="mt-3 flex-1 px-2 bg-slate-200 space-y-1">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-slate-200 text-slate-900 "
                          : "text-slate-500 hover:bg-slate-300 hover:text-gray-900",
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                      )}
                    >
                      <item.icon
                        className={classNames(
                          item.current
                            ? "text-slate-900"
                            : "text-slate-400 group-hover:text-gray-500",
                          "mr-3 flex-shrink-0 h-6 w-6"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </a>
                  ))}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div>
                  <button
                    onClick={handleLogout}
                    className="flex py-2 px-5 mr-3 font-normal text-sm text-white border-white bg-slate-600 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="md:pl-64 flex flex-col flex-1">
            <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white">
              <button
                type="button"
                className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <MenuIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <main className="flex-1">
              <div className="py-6">
                <div className="max-w-7xl mx-auto px-4  ">
                  <h1 className="text-4xl  text-slate-700 font-medium ml-7">
                    Penerbangan
                  </h1>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
                  <div className="flex flex-col mx-auto ">
                    {/* stats */}
                    <div className="">
                      <dl className="mt-5 grid grid-cols-1 rounded-lg bg-white overflow-hidden border divide-y shadow-md items-center divide-gray-200 md:grid-cols-4 md:divide-y-0 md:divide-x ">
                        {stats.map((item) => (
                          <div
                            key={item.name}
                            className="px-4 py-5 sm:p-6 hover:bg-gray-100"
                          >
                            <dd className="mt-1 flex flex-col justify-center items-center md:block lg:flex ">
                              <div className="flex items-center text-5xl font-bold text-blue-500">
                                {item.stat}

                                {/* <span className="ml-2 mt-10 text-sm font-medium text-gray-500"> {item.previousStat}</span> */}
                              </div>
                              <div className="justify-center">
                                <div className="text-base font-normal text-gray-900 mt-4">
                                  {item.name}
                                </div>
                              </div>
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>

                    <div className=" flex flex-row mt-5 gap-5">
                      <div className="flex flex-col">
                        <div className="font-semibold text-md">Daftar Kota</div>
                        <div className="border rounded-md shadow-md w-[385px] mt-4">
                          {/* City Cards */}
                          <div className="">
                            <div className="grid grid-cols-1 gap-2 overflow-y-auto h-[500px] mt-5">
                              {cities.map((cityName, index) => (
                                <CityCard key={index} cityName={cityName} />
                              ))}
                            </div>
                          </div>{" "}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="font-semibold text-md">
                          Daftar Negara
                        </div>
                        <div className="border rounded-md shadow-md w-[385px] mt-4">
                          {/* City Cards */}
                          <div className="">
                            <div className="grid grid-cols-1 gap-2 overflow-y-auto h-[500px] mt-5">
                              {countries.map((countriesName, index) => (
                                <CityCard
                                  key={index}
                                  cityName={countriesName}
                                />
                              ))}
                            </div>
                          </div>{" "}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="font-semibold text-md">
                          Daftar Kontinen
                        </div>
                        <div className="border rounded-md shadow-md w-[385px] mt-4">
                          {/* City Cards */}
                          <div className="">
                            <div className="grid grid-cols-1 gap-2 overflow-y-auto h-[500px] mt-5">
                              {continents.map((continentsName, index) => (
                                <CityCard
                                  key={index}
                                  cityName={continentsName}
                                />
                              ))}
                            </div>
                          </div>{" "}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* /End replace */}

                  {/* post penerbangan */}
                  <div className="my-20 ">
                    <h1 className="text-3xl text-center mb-5 text-slate-700 font-medium">
                      Tambah Penerbangan
                    </h1>
                    <div className="border shadow-md p-10 bg-slate-50">
                      <div className="flex justify-between">
                        <div>
                          <label className="block mb-2  font-semibold ">
                            Waktu Keberangkatan
                          </label>
                          <input
                            type="time"
                            name="time_departure"
                            value={timeDeparture}
                            onChange={handleTimeChange}
                            className="border border-slate-500 px-20 py-1 cursor-pointer rounded"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 font-semibold ">
                            Waktu Tiba
                          </label>
                          <input
                            type="time"
                            name="time_arrive"
                            value={timeArrive}
                            onChange={handleTimeChange}
                            className="border border-slate-500 px-20 py-1 cursor-pointer rounded"
                          />
                        </div>

                        <div>
                          <label className=" font-semibold ">Dari</label>
                          <div
                            className=" border mt-2 border-slate-500 px-20 py-1 cursor-pointer rounded"
                            onClick={onOpenFromModal}
                          >
                            {cityFromName || "Pilih Kota Tujuan"}
                          </div>

                          <Modal
                            open={openFromModal}
                            onClose={onCloseFromModal}
                            center
                          >
                            <h2 className="max-sm:text-sm sm:text-sm">
                              Masukkan Kota Asal
                            </h2>
                            <div className="mt-5 text-slate-700 font-semibold max-sm:text-sm max-sm:mb-3 sm:text-sm">
                              Saran Pencarian
                            </div>
                            <div className="overflow-y-scroll h-[300px] mt-2 max-sm:text-xs sm:text-sm">
                              {postCity?.map((data) => (
                                <div
                                  key={data.id}
                                  className="cursor-pointer hover:bg-gray-200 p-2 max-sm:border-b-2 max-sm:mb-2"
                                  onClick={() => onSelectCityFrom(data)}
                                >
                                  {data.name}
                                </div>
                              ))}
                            </div>
                          </Modal>
                        </div>

                        <div>
                          <label className=" font-semibold ">Ke</label>
                          <div
                            className="border mt-2 border-slate-500 px-20 py-1 cursor-pointer rounded"
                            onClick={onOpenToModal}
                          >
                            {cityDestinationName || "Pilih Kota Tujuan"}
                          </div>

                          <Modal
                            open={openToModal}
                            onClose={onCloseToModal}
                            center
                          >
                            <h2 className="max-sm:text-sm sm:text-sm">
                              Masukkan Kota Tujuan
                            </h2>
                            <div className="mt-5 text-slate-700 font-semibold max-sm:text-sm max-sm:mb-3 sm:text-sm">
                              Saran Pencarian
                            </div>
                            <div className="overflow-y-scroll h-[300px] mt-2 max-sm:text-xs sm:text-sm">
                              {postCity.map((data) => (
                                <div
                                  key={data.id}
                                  className="cursor-pointer hover:bg-gray-200 p-2 max-sm:border-b-2 max-sm:mb-2"
                                  onClick={() => onSelectCityTo(data)}
                                >
                                  {data.name}
                                </div>
                              ))}
                            </div>
                          </Modal>
                        </div>
                      </div>

                      <div className="mt-10 font-semibold mb-3">
                        Pilih Tanggal Keberangkatan
                      </div>
                      <div className="flex flex-wrap mt-2 justify-between text-sm">
                        {[
                          "is_monday",
                          "is_tuesday",
                          "is_wednesday",
                          "is_thursday",
                          "is_friday",
                          "is_saturday",
                          "is_sunday",
                        ].map((day) => (
                          <div key={day} className="mr-4">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                name={day}
                                checked={days[day]}
                                onChange={handleDayChange}
                                className="mr-2 w-5 h-5 cursor-pointer"
                              />
                              {day.replace("is_", "").charAt(0).toUpperCase() +
                                day.replace("is_", "").slice(1)}
                            </label>
                          </div>
                        ))}
                      </div>

                      <div className="mt-10 ">
                        <h3 className=" font-semibold ">Detail Penerbangan</h3>
                        <div className="">
                          {category.map((cat, index) => (
                            <div key={index} className="mb-4">
                              <div className="flex space-x-10">
                                <div className="mt-3 ">
                                  <label className="block text-sm">Price</label>
                                  <input
                                    type="number"
                                    value={cat.price}
                                    onChange={(e) =>
                                      handleCategoryChange(
                                        index,
                                        "price",
                                        e.target.value
                                      )
                                    }
                                    className="border  py-1 pr-10 pl-2 border-slate-500 rounded mb-2"
                                  />
                                </div>
                                <div className="mt-3">
                                  <label className="block text-sm">
                                    Pilih Kelas
                                  </label>
                                  <select
                                    value={cat.detail_plane_id}
                                    onChange={(e) =>
                                      handleCategoryChange(
                                        index,
                                        "detail_plane_id",
                                        e.target.value
                                      )
                                    }
                                    className="border py-1 pr-10 pl-2 border-slate-500 rounded"
                                  >
                                    <option value={1}>Ekonomi</option>
                                    <option value={2}>Ekonomi Premium</option>
                                    <option value={3}>Bisnis</option>
                                    <option value={4}>First Class</option>
                                    <option value={5}>Quite Zone</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={addCategory}
                          className="bg-slate-400 px-5 text-white p-2 text-xs rounded-full"
                        >
                          Tambah Detail
                        </button>
                      </div>

                      <div className="mt-10">
                        <label className="block mb-2 font-semibold ">
                          Diskon
                        </label>
                        <input
                          type="number"
                          name="discount"
                          value={discount}
                          onChange={handleDiscountChange}
                          className="border p-2 rounded"
                        />
                      </div>

                      <div className="flex justify-end ">
                        <button
                          onClick={handlePostPenerbangan}
                          className="mt-4 bg-blue-500 text-white p-2 px-5 text-sm rounded "
                        >
                          Tambah Penerbangan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
            {/* <Footer /> */}
          </div>
        </div>
      </>
    </div>
  );
}
