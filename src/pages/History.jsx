import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "../component/Nav";
import Footer from "../component/Footer";
import { useSelector } from "react-redux";
import { usePDF } from "react-to-pdf";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import BottomNav from "../component/BottomNav";

export default function History() {
  const [data, setData] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();

  // console.log("Orders fetched:", data);
  // console.log("Order details fetched:", orderDetails);

  // ----------------------------------------------------------------------------

  const token = useSelector((state) => state.auth.token);
  useEffect(() => {
    if (!token) {
      alert("login dulu");
      navigate("/login");
    }
  }, []);
  // console.log("token", token);

  useEffect(() => {
    fetchOrders();
  }, []);

  // -----------------------------------------------------------------------------
  const [currentPage, setCurrentPage] = useState(1);
  // console.log("currentPage", currentPage);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "https://expressjs-production-53af.up.railway.app/api/v1/ticket/orders?page=1",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.data);
      // console.log("Orders fetched:", response.data.data);
    } catch (error) {
      // console.error("Error fetching orders:", error);
    }
  };

  const fetchOrdersPagination = async (page) => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `https://expressjs-production-53af.up.railway.app/api/v1/ticket/orders?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.data);
      setCurrentPage(page);

      setIsLoading(false);

      // console.log("Orders fetched:", response.data.data);
    } catch (error) {
      // console.error("Error fetching orders:", error);
    }
  };

  // -----------------------------------------------------------------------------

  const location = useLocation();
  const dataOrderId = location.state;
  // console.log("data order id", dataOrderId);

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(
        `https://expressjs-production-53af.up.railway.app/api/v1/ticket/order/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrderDetails(response.data.data);
      // console.log("Order details fetched:", orderDetails);
    } catch (error) {
      // console.error("Error fetching order details:", error);
    }
  };

  useEffect(() => {
    fetchOrderDetails(dataOrderId);
  }, []);

  // -----------------------------------------------------------------------------

  const formatDateFlight = (date) => {
    const dateObj = new Date(date);
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return dateObj.toLocaleDateString("en-GB", options).replace(/ /g, " ");
  };

  const formatTime = (isoTime) => {
    const date = new Date(isoTime);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    return `${String(hours).padStart(2, "0")}.${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

  // -----------------------------------------------------------------------------

  const historyButton = () => {
    if (orderDetails?.status === "unpaid") {
      return (
        <div
          onClick={() => navigate("/paymentOrder", { state: orderDetails?.id })}
          className="bg-red-500 p-4 sm:w-[550px] mt-5 rounded-lg font-bold text-white max-sm:w-[full] max-sm:mx-3 text-center cursor-pointer sm:text-sm"
        >
          Lanjut Bayar
        </div>
      );
    } else if (orderDetails?.status === "paid") {
      return (
        <div
          onClick={() => toPDF()}
          className="bg-blue-500 p-4 sm:w-[550px] mt-5 rounded-lg font-bold text-white  max-sm:w-[full] max-sm:mx-3 text-center cursor-pointer sm:text-sm"
        >
          Cetak Tiket
        </div>
      );
    } else {
      return null;
    }
  };

  // -----------------------------------------------------------------------------
  // cetak tiket, price, convert time

  const { toPDF, targetRef } = usePDF({
    filename: `bukti_pemesanan_tiket_code_${orderDetails?.code}.pdf`,
  });

  const formatPrice = (price) => {
    return `IDR ${price.toLocaleString("id-ID")}`;
  };

  const convertMinutesToHoursAndMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // ---------------------------------------------------------------------------
  // api history (parameter search)

  const searchHistory = async (searchValue) => {
    try {
      const response = await axios.get(
        `https://expressjs-production-53af.up.railway.app/api/v1/ticket/orders?find=${searchValue}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const dataSearch = response.data.data;
      setData(dataSearch);
      // console.log("dataSearch", dataSearch);

      // console.log("Order details fetched:", orderDetails);
    } catch (error) {
      // console.error("Error fetching order details:", error);
    }
  };

  // -----------------------------------------------------------------------------
  // modal search history

  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const onOpenSearchModal = () => setOpenSearchModal(true);
  const onCloseSearchModal = () => setOpenSearchModal(false);

  const handleSearchHistory = () => {
    searchHistory(searchValue);
    setOpenSearchModal(false);
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  // -----------------------------------------------------------------------------------
  // is empty history

  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    if (data.length === 0) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  }, [data]);

  // ---------------------------------------------------------------------------------
  //  api history (parameter filter date)

  const sortDate = async () => {
    try {
      const response = await axios.get(
        ` https://expressjs-production-53af.up.railway.app/api/v1/ticket/orders?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const dataDate = response.data.data;
      setData(dataDate);
      // console.log("dataSearch", dataSearch);

      // console.log("Order details fetched:", orderDetails);
    } catch (error) {
      // console.error("Error fetching order details:", error);
    }
  };

  // -----------------------------------------------------------------------------
  // modal filter

  const [openDateModal, setOpenDateModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const onOpenDateModal = () => setOpenDateModal(true);
  const onCloseDateModal = () => setOpenDateModal(false);

  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  const handleSaveDates = () => {
    sortDate();
    onCloseDateModal();
  };

  // -----------------------------------------------------------------------------
  // api history (parameter filter status)

  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const filterByStatus = async (status) => {
    try {
      const response = await axios.get(
        `https://expressjs-production-53af.up.railway.app/api/v1/ticket/orders?filter=${status}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const dataFiltered = response.data.data;
      setData(dataFiltered);
      // console.log(`Data filtered by ${status}:`, dataFiltered);
    } catch (error) {
      // console.error(`Error fetching orders with status ${status}:`, error);
    }
  };

  const handleDropdownClick = (status) => {
    setSelectedStatus(status);
    filterByStatus(status);
    setOpenDropdown(false);
  };

  // -----------------------------------------------------------------------------

  const formRef = useRef(null);

  const handleButtonClick = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // -------------------------------------------------------------------------

  const handleButtonClick2 = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="">
      <div className=" max-sm:h-[60px] ">
        <Nav isHomePage={false} />
        {/* <div className="container flex flex-col justify-center p-6 sm:py-12 sm:px-40 lg:py-20 lg:flex-row lg:justify-between"></div> */}
      </div>

      <div className="flex flex-col mx-auto sm:px-40 sm:mt-20">
        <div className="flex justify-between max-sm:text-xs">
          <div className="flex sm:mt-10  font-semibold items-center sm:p-4 max-sm:p-2  bg-slate-500 sm:w-[1350px]  text-white  max-sm:w-full">
            <div className="flex sm:text-base">
              <div className="sm:mr-7 max-sm:mr-3">
                <button onClick={() => navigate("/")} className="">
                  ←
                </button>
              </div>
              Beranda
            </div>
          </div>
          <div className="relative">
            <div>
              <button
                onClick={onOpenSearchModal}
                className="bg-white border-slate-600 border font-semibold text-slate-600 mt-10 py-5 px-14 max-sm:hidden sm:text-base"
              >
                search
              </button>
              <button
                onClick={onOpenSearchModal}
                className="sm:bg-blue-400 text-white font-medium border sm:rounded-2xl sm:px-10 max-sm:px-3 sm:hidden sm:ml-2 sm:py-4 max-sm:py-3 sm:text-lg max-sm:-ml-10 max-sm:bg-white max-sm:border-slate-600 max-sm:text-slate-600"
              >
                search
              </button>
              <Modal open={openSearchModal} onClose={onCloseSearchModal} center>
                <h2 className="max-sm:text-sm sm:text-sm">
                  Masukkan Booking Code
                </h2>
                <input
                  type="text"
                  value={searchValue}
                  onChange={handleInputChange}
                  placeholder="ex : T02HUB5L"
                  className="border p-2 max-sm:text-xs max-sm:mt-2 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={handleSearchHistory}
                  className="mt-4 sm:ml-2 p-2 px-5 bg-slate-500 text-white max-sm:text-xs sm:text-sm"
                >
                  Search
                </button>
              </Modal>
            </div>
          </div>
        </div>

        {/* filter dekstop */}
        <div className="max-sm:hidden">
          {/* <div className="mt-5 text-slate-600 sm:hidden ml-5 ">Filter by :</div> */}

          <div className="flex sm:justify-start sm:ml-5 sm:mt-10 max-sm:mt-2">
            {/* <div className="mt-3 mr-5 text-slate-600 max-sm:hidden sm:text-sm">
              Filter by :
            </div> */}
            <button
              onClick={onOpenDateModal}
              className="bg-white text-slate-500   py-2 px-2  font-medium text-xs border-b border-gray-400 hover:bg-white hover:text-slate-700 sm:w-full max-sm:w-[100px] lg:w-[130px] "
            >
              Expired Date
            </button>
            <Modal open={openDateModal} onClose={onCloseDateModal} center>
              <h2 className="max-sm:mt-6 max-sm:text-sm sm:text-sm">
                Masukkan Tanggal Expired
              </h2>
              <div className="sm:flex mt-5 sm:text-sm max-sm:text-xs ">
                <div>
                  <label htmlFor="startDate" className="max-sm:flex">
                    from{" "}
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="border p-2 text-gray-500 "
                  />
                </div>
                <div className="sm:ml-10 max-sm:mt-3">
                  <label htmlFor="endDate" className="max-sm:flex">
                    to{" "}
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="border p-2 text-gray-500"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleSaveDates}
                className="sm:mt-5 max-sm:mt-4 p-2 px-5 bg-slate-500 text-white sm:ml-80 max-sm:text-xs sm:text-sm "
              >
                Save
              </button>
            </Modal>
            <div className=" sm:ml-5">
              <div>
                <button
                  type="button"
                  onClick={() => setOpenDropdown(!openDropdown)}
                  className="bg-white text-slate-500   py-2 px-2  font-medium text-xs border-b border-gray-400 hover:bg-white hover:text-slate-700 sm:w-full max-sm:w-[100px] lg:w-[130px] "
                  id="options-menu"
                  aria-haspopup="true"
                  aria-expanded="true"
                >
                  {selectedStatus || "Status"}
                </button>
              </div>
              {openDropdown && (
                <div
                  className="origin-top-right   mt-2 w-56 rounded-md shadow-lg bg-slate-400 ring-1 ring-black ring-opacity-5"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <div className="py-1" role="none">
                    <a
                      onClick={() => handleDropdownClick("paid")}
                      className="cursor-pointer block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      Paid
                    </a>
                    <a
                      onClick={() => handleDropdownClick("unpaid")}
                      className="cursor-pointer block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      Unpaid
                    </a>
                    <a
                      onClick={() => handleDropdownClick("cancelled")}
                      className="cursor-pointer block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      Cancelled
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* all order */}
        <div className="sm:flex max-sm:mt-10 sm:justify-between max-sm:flex max-sm:flex-wrap-reverse max-sm:text-sm">
          {isEmpty ? (
            <div className="sm:flex sm:flex-col mt-10 sm:px-60 mx-auto max-sm:px-10">
              <img
                src="assets/not_found.png"
                alt="No Data"
                className="sm:h-[250px] sm:w-[300px]"
              />
              <h2 className="sm:text-lg font-semibold mt-4 max-sm:text-sm max-sm:text-center">
                Maaf, history Anda tidak ditemukan
              </h2>
              <div
                onClick={onOpenSearchModal}
                className="text-slate-600 cursor-pointer max-sm:text-xs max-sm:text-center max-sm:mt-2"
              >
                Coba cari history lainnya!
              </div>
            </div>
          ) : (
            <div className="max-sm:text-xs">
              <div className="border-gray-300 border-b-2 my-3 sm:hidden mx-36 max-sm:mt-5 "></div>
              <div className="sm:hidden sm:text-xl max-sm:text-sm font-bold text-black justify-center flex">
                Riwayat Pesanan Anda
              </div>

              {/* filter mobile */}
              <div className="sm:hidden max-sm:text-xs px-5">
                <div className="flex sm:justify-end sm:mt-5 max-sm:mt-2 max-sm:justify-center">
                  <div className="w-full">
                    <div className="mt-3 mr-5 text-slate-600 max-sm:hidden">
                      Filter by :
                    </div>
                    <button
                      onClick={onOpenDateModal}
                      className=" border text-white sm:text-sm bg-slate-500 sm:rounded-full w-full py-3 sm:mr-5  max-sm:mb-2"
                    >
                      Expired Date
                    </button>
                  </div>
                  <div className="w-full">
                    <div>
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(!openDropdown)}
                        className=" border text-white sm:text-sm bg-slate-500 sm:rounded-full w-full py-3  "
                        id="options-menu"
                        aria-haspopup="true"
                        aria-expanded="true"
                      >
                        {selectedStatus || "Status"}
                      </button>
                    </div>
                    {openDropdown && (
                      <div
                        className="origin-top-left  sm:right-32  mt-2 w-[140px]  rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <div className="py-1" role="none">
                          <a
                            onClick={() => handleDropdownClick("paid")}
                            className="cursor-pointer block px-4 py-2 sm:text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            role="menuitem"
                          >
                            Paid
                          </a>
                          <a
                            onClick={() => handleDropdownClick("unpaid")}
                            className="cursor-pointer block px-4 py-2 sm:text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            role="menuitem"
                          >
                            Unpaid
                          </a>
                          <a
                            onClick={() => handleDropdownClick("cancelled")}
                            className="cursor-pointer block px-4 py-2 sm:text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            role="menuitem"
                          >
                            Cancelled
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div
                onClick={handleButtonClick2}
                className="sm:w-[620px] overflow-y-scroll sm:mt-5 sm:h-[750px] max-sm:h-[500px] max-sm:mt-5 max-sm:w-[full] max-sm:mr-5"
              >
                {data.map((order) => (
                  <div
                    className="cursor-pointer shadow-xl ml-5 border-2 bg-slate-200 px-6 py-4 sm:mr-10 rounded-xl mb-10 transition duration-300 ease-in-out transform hover:scale-105"
                    key={order.id}
                    onClick={() => fetchOrderDetails(order.id)}
                  >
                    <div className="flex justify-between items-center mb-2 sm:text-sm max-sm:text-[10px]">
                      <span
                        className={`sm:py-1.5 sm:px-4 max-sm:py-1 max-sm:px-2 rounded-full text-white ${
                          order.status === "paid"
                            ? "bg-green-500"
                            : order.status === "unpaid"
                            ? "bg-red-500"
                            : "bg-gray-400"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center sm:my-8 max-sm:mt-3  sm:text-sm max-sm:text-xs">
                      <div className="">
                        <div className="sm:text-md font-bold ">
                          {order?.detailFlight?.flight?.city_arrive?.name}
                        </div>
                        <div className="sm:text-xs text-gray-500  max-sm:text-[10px]">
                          {formatDateFlight(
                            order?.detailFlight?.flight?.date_flight
                          )}
                        </div>
                        <div className="sm:text-xs  max-sm:text-[10px]">
                          {" "}
                          {formatTime(
                            order?.detailFlight?.flight?.time_departure
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-center ">
                        <div className="text-xs text-gray-500 max-sm:hidden">
                          {convertMinutesToHoursAndMinutes(
                            order?.detailFlight?.flight?.estimation_minute
                          )}
                        </div>
                        <div className="sm:w-48 border-t-2 border-gray-300 max-sm:w-[10px] max-sm:mx-3 "></div>
                      </div>

                      <div className="max-sm:text-end">
                        <div className="sm:text-md font-bold ">
                          {" "}
                          {order?.detailFlight?.flight?.city_destination?.name}
                        </div>
                        <div className="text-xs text-gray-500   max-sm:text-[10px]">
                          {" "}
                          {formatDateFlight(
                            order?.detailFlight?.flight?.date_flight
                          )}
                        </div>
                        <div className="text-xs  max-sm:text-[10px]">
                          {" "}
                          {formatTime(order?.detailFlight?.flight?.time_arrive)}
                        </div>
                      </div>
                    </div>
                    <div className="border-b border-gray-300 sm:my-8 max-sm:my-3"></div>
                    <div className="flex justify-between">
                      <div className="flex mr-24">
                        <div className="sm:text-sm text-gray-500  max-sm:text-[10px]">
                          Booking Code :{" "}
                          <span className="text-slate-600 font-bold">
                            {order?.code}
                          </span>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="sm:text-sm text-slate-600 font-bold  max-sm:text-[10px]">
                          {
                            order?.detailFlight?.detailPlaneId?.seat_class
                              ?.type_class
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination */}
              <div className="max-sm:flex max-sm:justify-end max-sm:mb-20">
                <div className="flex justify-end items-center sm:mt-10 max-sm:mr-5 max-sm:mt-2 max-sm:mb-5 ">
                  <button
                    disabled={currentPage === 1 || isLoading}
                    onClick={() => fetchOrdersPagination(currentPage - 1)}
                    className="sm:px-3 sm:py-1 max-sm:px-3 max-sm:py-1.5 bg-slate-500 text-white "
                  >
                    <span>{"<"}</span>
                  </button>
                  <span className="sm:mx-4 max-sm:mx-3 font-medium max-sm:text-xs  sm:text-xs">
                    {currentPage}
                  </span>
                  <button
                    disabled={isLoading}
                    onClick={() => fetchOrdersPagination(currentPage + 1)}
                    className="sm:px-3 sm:py-1 max-sm:px-3 max-sm:py-1.5 bg-slate-500 text-white "
                  >
                    <span>{">"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* order Detail */}

          {orderDetails && (
            <div className="sm:mt-5 max-sm:text-xs">
              <div className="sm:hidden" ref={formRef}></div>

              <div className="border-gray-300 border-b-2  sm:hidden mx-36  mb-3 max-sm:-mt-3"></div>
              <div className="sm:hidden max-sm:mb-5 sm:text-xl max-sm:text-base font-bold text-black justify-center flex sm:mb-5">
                Tiket Anda
              </div>

              <div className="sm:w-[550px] border border-gray-300 rounded p-4 max-sm:w-[full] max-sm:mx-3">
                <div className=" p-2" ref={targetRef}>
                  <div className="text-gray-700 flex flex-col text-left">
                    <div className="flex justify-between">
                      <div className="font-bold mb-2 sm:text-lg text-black max-sm:text-base">
                        Detail pesanan
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span
                          className={` sm:px-4 sm:py-1.5 max-sm:px-3 max-sm:py-1 rounded-full text-white sm:text-sm ${
                            orderDetails.status === "paid"
                              ? "bg-green-500"
                              : orderDetails.status === "unpaid"
                              ? "bg-red-500"
                              : "bg-gray-400"
                          }`}
                        >
                          {orderDetails.status}
                        </span>
                      </div>
                    </div>
                    <div className="font-normal mb-2 sm:text-sm text-black">
                      Booking Code :{" "}
                      <span className="text-slate-600 font-bold">
                        {orderDetails.code}
                      </span>
                    </div>
                    <div className="border-gray-300 border-b-2 my-3 sm:hidden"></div>
                    <div className="flex justify-between sm:text-sm">
                      <div>
                        <div className="font-bold">
                          {orderDetails?.detailFlight?.flight?.time_departure}
                        </div>
                        <div>
                          {" "}
                          {formatDateFlight(
                            orderDetails?.detailFlight?.flight?.date_flight
                          )}
                        </div>
                        <div>
                          {
                            orderDetails?.detailFlight?.flight?.city_arrive
                              ?.airport_name
                          }
                        </div>
                        <div className="font-bold">
                          {
                            orderDetails?.detailFlight?.flight?.city_arrive
                              ?.name
                          }
                        </div>
                      </div>
                      <div className="mt-6 text-slate-600 font-bold ">
                        Keberangkatan
                      </div>
                    </div>
                  </div>
                  <div className="border-gray-300 border-b-2 my-3"></div>
                  <div className="text-gray-700 flex flex-col text-left sm:text-sm">
                    <div className="font-bold">
                      {orderDetails?.detailFlight?.detailPlane?.plane?.name} -{" "}
                      {
                        orderDetails?.detailFlight?.detailPlane?.seat_class
                          ?.type_class
                      }
                      <div>
                        {orderDetails?.detailFlight?.flight?.flight_number}
                      </div>
                    </div>
                    <div className="mt-3">
                      informasi :
                      <div className="italic">
                        {" "}
                        {orderDetails?.passenger?.map((e, i) => (
                          <div key={i}>
                            <div className="text-blue-500 font-bold">
                              penumpang {i + 1} : {e?.title}. {e?.fullname}
                            </div>
                            <div className="font-medium">id : 00B6-{e?.id}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="border-gray-300 border-b-2 my-3"></div>
                  <div className="text-gray-700 flex flex-col text-left sm:text-sm">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-bold">
                          {" "}
                          {orderDetails?.detailFlight?.flight?.time_arrive}
                        </div>
                        <div>
                          {" "}
                          {formatDateFlight(
                            orderDetails?.detailFlight?.flight?.date_flight
                          )}
                        </div>
                        <div>
                          {" "}
                          {
                            orderDetails?.detailFlight?.flight?.city_destination
                              ?.airport_name
                          }
                        </div>
                        <div className="font-bold">
                          {
                            orderDetails?.detailFlight?.flight?.city_destination
                              ?.name
                          }
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
                        <div>harga tiket </div>
                        <div>
                          {formatPrice(orderDetails?.detailFlight?.price)}{" "}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div>total penumpang </div>
                        <div>{orderDetails?.passenger?.length}</div>
                      </div>
                    </div>
                    <div className="border-gray-300 border-b-2 my-3"></div>
                    <div className="flex justify-between">
                      <div className=" font-bold sm:text-base text-black">
                        Total Harga
                      </div>
                      <div className="text-red-500 font-bold sm:text-lg">
                        <div>
                          {" "}
                          {formatPrice(
                            orderDetails?.detailFlight?.price *
                              orderDetails?.passenger?.length
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>{historyButton()}</div>
            </div>
          )}
        </div>
      </div>
      <div className="">
        <div className="sm:mt-20  max-sm:hidden">
          <Footer />
        </div>
        <div className="sm:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
