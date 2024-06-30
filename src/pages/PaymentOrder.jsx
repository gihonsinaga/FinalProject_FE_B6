import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "../component/Nav";
import Footer from "../component/Footer";
import axios from "axios";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

// import { Modal } from "react-responsive-modal";
import Modal from "react-modal";
import "react-responsive-modal/styles.css";

export default function PaymentOrder() {
  const [paymentData, setPaymentData] = useState([]); //data yang akan dikirim ke done payment utk cetak tiket
  const location = useLocation();
  const navigate = useNavigate();
  // Tempat menampung data idorder dari componen Checkout
  const idOrderPayment = location.state;
  // console.log("id order", location.state);
  useEffect(() => {
    if (!idOrderPayment) {
      alert("Pesan dulu!");
      navigate("/");
    }
  }, []);

  // --------------------------------------------------------------------------
  // get detail order

  const token = useSelector((state) => state.auth.token);
  // console.log("token", token);

  const [order, setOrder] = useState([]);
  const [statusOrder, setStatusOrder] = useState("unpaid");
  const [openStatusModal, setOpenStatusModal] = useState(false);

  const payOrder = async () => {
    try {
      const response = await axios.get(
        `https://express-development-3576.up.railway.app/api/v1/ticket/order/${idOrderPayment}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data.data;
      const status = response.data.data.status;
      setStatusOrder(status);
      setOrder(data);
      // console.log("status", status);
      // console.log("data order", data);
      // console.log("bill", bill);
      // console.log("Response setelah isi form:", response.data);
    } catch (error) {
      // console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    payOrder();
  }, []);

  useEffect(() => {
    if (statusOrder === "paid") {
      setOpenStatusModal(true);
    }
  }, [statusOrder]);

  const onCloseModal = () => {
    setOpenStatusModal(false);
    navigate("/donepayment", { state: paymentData });
  };

  Modal.setAppElement("#root");

  //--------------------------------------------------------------------------

  const formatDateFlight = (date) => {
    const dateObj = new Date(date);
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return dateObj.toLocaleDateString("en-GB", options).replace(/ /g, " ");
  };

  // -------------------------------------------------------------------------
  // state untuk body payment

  const [openIndex, setOpenIndex] = useState(null);
  const [methodPayment, setMethodPayment] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const handleCardNumber = (e) => {
    setCardNumber(e.target.value);
  };
  const [cardHolderName, setCardHolderName] = useState("");
  const handleCardOrderName = (e) => {
    setCardHolderName(e.target.value);
  };
  const [cvv, setCvv] = useState("");
  const handleSetCvv = (e) => {
    setCvv(e.target.value);
  };
  const [expiryDate, setExpiryDate] = useState("");
  const handleSetExpiryDate = (e) => {
    setExpiryDate(e.target.value);
  };
  // console.log("methodPayment", methodPayment);
  // console.log("cardNumber", cardNumber);
  // console.log("cardHolderNamed", cardHolderName);
  // console.log("cvv", cvv);
  // console.log("expiryDate", expiryDate);

  const handleToggle = (index, method) => {
    setOpenIndex(openIndex === index ? null : index);
    setMethodPayment(method);
  };

  // --------------------------------------------------------------------------
  // payment biasa

  const handlePayment = async () => {
    try {
      const response = await axios.post(
        `https://express-development-3576.up.railway.app/api/v1/payment/${idOrderPayment}`,
        {
          method_payment: methodPayment,
          cardNumber,
          cardHolderName,
          cvv,
          expiryDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const dataPayment = response.data.data;
      setPaymentData(dataPayment);
      // console.log("data payment biasa", dataPayment);
      setOpenStatusModal(true);
    } catch (error) {
      // console.error("Error fetching data:", error);
      toast.error(error?.response?.data?.message);
    }
  };

  // ----------------------------------------------------------
  // payment with midtrans

  const handlePaymentMidtrans = async () => {
    try {
      const response = await axios.post(
        `https://express-development-3576.up.railway.app/api/v1/payment/midtrans/${idOrderPayment}`,
        {
          method_payment: methodPayment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const dataMidtrans = response.data.data;
      // setPaymentData(dataMidtrans);
      // console.log("data midtrans", dataMidtrans);
      const url = response.data.data.redirect_url;
      // console.log("url", url);
      window.open(url, "_blank");
      // setOpenStatusModal(true);
      toast("silahkan refresh page jika sudah bayar", {
        duration: 100000,
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } catch (error) {
      // console.error("Error fetching data:", error);
      toast.error("silahkan masukkan data yang benar");
    }
  };

  // ---------------------------------------------------------

  const formatDate = (isoString) => {
    const date = new Date(isoString);

    const day = date.getUTCDate();
    const month = date.getUTCMonth();
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();

    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const formattedDate = `${day} ${monthNames[month]} ${year} pukul ${String(
      hours
    ).padStart(2, "0")}.${String(minutes).padStart(2, "0")}`;

    return formattedDate;
  };

  const formatPrice = (price) => {
    return price
      ? `IDR ${price.toLocaleString("id-ID")}`
      : "Price not available";
  };

  // --------------------------------------------------------------------------

  return (
    <div className="">
      <div className="text-xs">
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>

      <Modal
        isOpen={openStatusModal}
        onRequestClose={onCloseModal}
        contentLabel="Payment Successful"
        className="fixed inset-0 flex justify-center items-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="bg-white rounded w-full h-full flex flex-col justify-center items-center">
          <div className="bg-white p-8 shadow-2xl shadow-gray-600 rounded text-center animate-zoom-in">
            <img src="assets/done_payment.gif" className="w-[400px]" alt="" />
            <h2 className="sm:text-base font-semibold mb-2 max-sm:text-sm">
              Pembayaran Berhasil
            </h2>
            <p className="mb-4 text-gray-600  sm:text-sm max-sm:text-xs">
              Silahkan klik untuk melanjutkan
            </p>
            <button
              onClick={onCloseModal}
              className="bg-slate-600 text-white text-xs font-medium px-6 py-2 rounded"
            >
              Lanjut
            </button>
          </div>
        </div>
      </Modal>

      <div className={`max-sm:h-[60px] " ${openStatusModal ? "hidden" : ""}`}>
        <Nav />
        {/* <div className="container flex flex-col justify-center p-6 mx-auto sm:py-12 sm:px-40 lg:py-20 lg:flex-row lg:justify-between"></div> */}
      </div>

      <div className=" sm:hidden justify-center sm:mt-10 font-normal items-center p-3  bg-red-500 w-[full] text-white max-sm:text-xs max-sm:text-center max-sm:font-extralight max-sm:italic">
        Selesaikan pembayaran sebelum{" "}
        <div className="italic ml-2 font-normal max-sm:font-extralight">
          {" "}
          {formatDate(order?.expired_paid)}{" "}
        </div>
      </div>

      <div className="flex flex-col mx-auto sm:px-40 sm:mt-20">
        <div className="flex text-black font-bold text-lg sm:mt-10 max-sm:justify-center max-sm:text-sm  max-sm:mt-3 sm:ml-4">
          Isi Data Diri
          <div className="flex  text-gray-400">
            <div className="sm:ml-4 max-sm:ml-2">{">"}</div>
            <div className="sm:ml-4 text-black max-sm:ml-2">Bayar</div>
            <div className="sm:ml-4 max-sm:ml-2">{">"}</div>
            <div className="sm:ml-4 max-sm:ml-2">Selesai</div>
          </div>
        </div>

        <div className="sm:flex max-sm:hidden justify-center sm:mt-2 font-normal items-center p-4 sm:text-sm bg-red-500 w-[full] text-white rounded-2xl max-sm:mx-5 max-sm:text-sm max-sm:text-center max-sm:mt-3 max-sm:font-extralight italic">
          Selesaikan pembayaran sebelum{" "}
          <div className="italic ml-2 font-normal max-sm:font-extralight">
            {" "}
            {formatDate(order?.expired_paid)}{" "}
          </div>
        </div>

        <div className="mt-10 flex justify-between sm:mx-7 max-sm:flex-wrap-reverse">
          {/* pilih payment */}
          <div className="max-sm:text-sm max-sm:mx-3">
            <div className="text-slate-600 font-bold sm:text-xl max-sm:text-base max-sm:mt-10 max-sm:text-center ">
              Isi Data Pembayaran
            </div>
            <div className="border-slate-50 border-b-2 my-3 sm:hidden px-40 max-sm:mt-2"></div>

            <div className="flex flex-col items-center sm:mt-5 max-sm:mr-5 ">
              <div className="sm:w-[550px] max-sm:w-full">
                {/* midtrans Section */}
                <div
                  className="flex justify-between bg-gray-700  text-white font-medium pl-5 py-4 cursor-pointer rounded max-sm:text-xs sm:text-sm"
                  onClick={() => handleToggle(0, "midtrans")}
                >
                  Midtrans
                  <div className="pr-5 pt-2">
                    <img
                      src="assets/dropdown_payment.png"
                      alt="Toggle"
                      className="w-[15px] max-sm:w-[10px]"
                    />
                  </div>
                </div>
                {openIndex === 0 && (
                  <div className="w-full mt-4 p-6 bg-white rounded-lg shadow-lg  max-sm:text-xs  sm:text-sm">
                    <div>
                      <h2 className="sm:text-base max-sm:text-base font-semibold mb-4  ">
                        All payment methods
                      </h2>
                      <div className="space-y-4 ">
                        <div className="flex flex-col border-b border-gray-300 pb-3 ">
                          <span>GoPay/GoPay Later</span>
                          <img
                            src="/assets/gopay.png"
                            alt="GoPay"
                            className="w-[150px]"
                          />
                        </div>
                        <div className="flex flex-col border-b border-gray-300 pb-3 ">
                          <span>Virtual account</span>
                          <img
                            src="assets/bank.png"
                            alt="Virtual Account"
                            className="w-[300px]"
                          />
                        </div>
                        <div className="flex flex-col border-b border-gray-300  pb-3">
                          <span>Credit/debit card</span>
                          <img
                            src="assets/visa.png"
                            alt="Credit Card"
                            className="w-[150px]"
                          />
                        </div>
                        <div className="flex flex-col border-b border-gray-300 pb-3 ">
                          <span>ShopeePay/SPayLater</span>
                          <img
                            src="assets/shoope.png"
                            alt="ShopeePay"
                            className="w-[150px]"
                          />
                        </div>
                        <div className="flex flex-col border-b border-gray-300 pb-3 ">
                          <span>QRIS</span>
                          <img
                            src="assets/qris.png"
                            alt="QRIS"
                            className="w-[150px]"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => handlePaymentMidtrans()}
                        className="w-full bg-gray-700 text-white  max-sm:py-2 sm:py-3 mt-5 rounded-md text-base  max-sm:text-xs  sm:text-sm"
                      >
                        Lanjut
                      </button>
                    </div>
                  </div>
                )}

                {/* Credit Card Section */}
                <div
                  className="flex justify-between bg-blue-500 text-white font-medium mt-2 pl-5 py-4 cursor-pointer rounded  max-sm:text-xs  sm:text-sm"
                  onClick={() => handleToggle(2, "credit_card")}
                >
                  Credit Card
                  <div className="pr-5 pt-2">
                    <img
                      src="assets/dropdown_payment.png"
                      alt="Toggle"
                      className="w-[15px] max-sm:w-[10px]"
                    />
                  </div>
                </div>
                {openIndex === 2 && (
                  <div className="w-full mt-4 p-6 bg-white rounded-lg shadow-lg  max-sm:text-xs ">
                    <div className="flex justify-center space-x-2 mb-4">
                      <img src="assets/Payment options.png" alt="" />
                    </div>

                    <form className=" max-sm:text-xs">
                      <div className="mb-4">
                        <label
                          htmlFor="card-number"
                          className="block sm:text-sm font-medium text-gray-700 "
                        >
                          Card number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={handleCardNumber}
                          id="card-number"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="4480 0000 0000 0000"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="card-holder-name"
                          className="block sm:text-sm font-medium text-gray-700"
                        >
                          Card holder name
                        </label>
                        <input
                          type="text"
                          value={cardHolderName}
                          onChange={handleCardOrderName}
                          id="card-holder-name"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="John Doe"
                        />
                      </div>

                      <div className="flex space-x-4 mb-4">
                        <div className="flex-1">
                          <label
                            htmlFor="cvv"
                            className="block sm:text-sm font-medium text-gray-700"
                          >
                            CVV
                          </label>
                          <input
                            type="text"
                            value={cvv}
                            onChange={handleSetCvv}
                            id="cvv"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="000"
                          />
                        </div>

                        <div className="flex-1">
                          <label
                            htmlFor="expiry-date"
                            className="block sm:text-sm font-medium text-gray-700"
                          >
                            Expiry date
                          </label>
                          <input
                            type="text"
                            value={expiryDate}
                            onChange={handleSetExpiryDate}
                            id="expiry-date"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="07/24"
                          />
                        </div>
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => handlePayment()}
                          className="w-full bg-blue-600 text-white max-sm:py-2 sm:py-3 rounded-md text-base  max-sm:text-xs  sm:text-sm"
                        >
                          Bayar
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="max-sm:w-full">
            <div className="sm:w-[520px] max-sm:text-xs sm:text-sm border border-gray-300 rounded p-4 max-sm:mx-3">
              <div className="text-gray-700 flex flex-col text-left">
                {/* <div className="border-gray-300 border-b-2 mb-3"></div> */}

                <div className="font-bold mb-2 sm:text-lg text-black max-sm:text-sm ">
                  Booking code :{" "}
                  <span className="text-blue-500 italic">{order?.code}</span>
                </div>
                <div>
                  <div>
                    {" "}
                    <div className="flex justify-between">
                      <div>
                        <div className="font-bold">
                          {order?.detailFlight?.flight?.time_departure}
                        </div>
                        <div>
                          {" "}
                          {formatDateFlight(
                            order?.detailFlight?.flight?.date_flight
                          )}
                        </div>
                        <div>
                          {
                            order?.detailFlight?.flight?.city_arrive
                              ?.airport_name
                          }
                        </div>
                        <div className="font-bold">
                          {order?.detailFlight?.flight?.city_arrive?.name}
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
                      {order?.detailFlight?.detailPlane?.plane?.name} -{" "}
                      {order?.detailFlight?.detailPlane?.seat_class?.type_class}
                      <div>{order?.detailFlight?.flight?.flight_number}</div>
                    </div>
                    <div className="mt-3">
                      informasi :
                      <div className="italic">
                        {" "}
                        {order?.passenger?.map((e, i) => (
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
                  <div className="text-gray-700 flex flex-col text-left">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-bold">
                          {" "}
                          {order?.detailFlight?.flight?.time_arrive}
                        </div>
                        <div>
                          {" "}
                          {formatDateFlight(
                            order?.detailFlight?.flight?.date_flight
                          )}
                        </div>
                        <div>
                          {" "}
                          {
                            order?.detailFlight?.flight?.city_destination
                              ?.airport_name
                          }
                        </div>
                        <div className="font-bold">
                          {order?.detailFlight?.flight?.city_destination?.name}
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
                          {/* {formatPrice(order?.detailFlight?.price)} */}
                          {order?.detailFlight?.price !== undefined
                            ? formatPrice(order.detailFlight.price)
                            : "Price not available"}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div>total penumpang </div>
                        <div>{order?.passenger?.length}</div>
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
                          {order?.detailFlight?.price !== undefined
                            ? formatPrice(
                                order?.detailFlight?.price *
                                  order?.passenger?.length
                              )
                            : "Price not available"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
