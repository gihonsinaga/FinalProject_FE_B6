import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "../component/Nav";
import Footer from "../component/Footer";
import axios from "axios";
import { useSelector } from "react-redux";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  // Tempat menampung data idorder dari componen Checkout
  const idOrder = location.state;
  useEffect(() => {
    if (!idOrder) {
      alert("Pesan dulu!");
      navigate("/");
    }
  }, []);

  // console.log("idOrder", idOrder);

  // ---------------------------------------------------------------------------------------
  // api get detail order

  const [order, setOrder] = useState([]);
  const token = useSelector((state) => state.auth.token);
  // console.log("token", token);

  const payOrder = async () => {
    try {
      const response = await axios.get(
        `https://express-development-3576.up.railway.app/api/v1/ticket/order/${idOrder}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data.data;
      setOrder(data);
      // console.log("order", order);
      // console.log("data", data);
      // console.log("bill", bill);
      // console.log("Response setelah isi form:", response.data);
    } catch (error) {
      // console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    payOrder();
  }, []);

  //--------------------------------------------------------------------------
  // get detail tiket dari reducers

  const ticket = useSelector((state) => state.ticket.detailTicket);
  // console.log("ticket", ticket);

  const formatDateFlight = (date) => {
    const dateObj = new Date(date);
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return dateObj.toLocaleDateString("en-GB", options).replace(/ /g, " ");
  };

  // -------------------------------------------------------------------------

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatPrice = (price) => {
    return `IDR ${price.toLocaleString("id-ID")}`;
  };

  // --------------------------------------------------------------------------

  const user = useSelector((state) => state.auth.user);
  // console.log("user", user);

  const allPassenger = useSelector((state) => state.ticket.allPassenger);
  // console.log("allPassenger", allPassenger);

  // --------------------------------------------------------------------------

  return (
    <div>
      <div className=" max-sm:h-[60px] ">
        <Nav isHomePage={false} />
        {/* <div className="container flex flex-col justify-center p-6 sm:py-12 sm:px-40 lg:py-20 lg:flex-row lg:justify-between"></div> */}
      </div>

      <div className="flex justify-center sm:hidden font-semibold items-center p-3  bg-green-500 w-[full] text-white max-sm:font-light max-sm:text-xs max-sm:italic">
        Data anda berhasil tersimpan
      </div>

      <div className="flex flex-col mx-auto sm:px-40 sm:mt-20">
        <div className="flex text-black font-bold text-xl sm:mt-10 max-sm:justify-center  max-sm:text-sm  max-sm:mt-3 sm:ml-4">
          Isi Data Diri
          <div className="flex  text-gray-400">
            <div className="sm:ml-4 max-sm:ml-2">{">"}</div>
            <div className="sm:ml-4 max-sm:ml-2 text-black">Bayar</div>
            <div className="sm:ml-4 max-sm:ml-2">{">"}</div>
            <div className="sm:ml-4 max-sm:ml-2">Selesai</div>
          </div>
        </div>

        <div className="flex max-sm:hidden justify-center mt-2 font-semibold items-center p-4 text-sm bg-green-500 w-[full] text-white rounded-2xl max-sm:mx-5 max-sm:mt-3 max-sm:font-light max-sm:text-sm italic">
          Data anda berhasil tersimpan
        </div>

        <div className="mt-10 flex justify-between sm:mx-4 max-sm:flex-wrap-reverse  ">
          {/* data user */}
          <div>
            <div className="border shadow-xl shadow-gray-400  rounded-xl pt-10 pb-14  px-4  max-sm:mx-4 max-sm:mt-10 max-sm:w-[full]  max-sm:text-xs sm:text-sm">
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
                Nama Keluarga
              </div>
              <div className="mt-1 p-2 border border-gray-400 rounded sm:w-[520px] h-[40px] mx-auto text-gray-500 max-sm:w-full">
                {user?.data?.family_name}
              </div>
              <div className="mt-5 sm:ml-5 text-slate-600 font-semibold">
                Nomor Telepon
              </div>
              <div className="mt-1 p-2 border border-gray-400 rounded sm:w-[520px] h-[40px] mx-auto text-gray-500 max-sm:w-full">
                {user?.data?.phoneNumber}
              </div>
              <div className="mt-5 sm:ml-5 text-slate-600 font-semibold">
                Email
              </div>
              <div className="mt-1 p-2 border border-gray-400 rounded sm:w-[520px] h-[40px] mx-auto text-gray-500 max-sm:w-full">
                {user?.data?.email}
              </div>
            </div>

            {/* isi data penumpang */}
            <div>
              <div className="mt-10">
                {order?.passenger?.map((passenger, index) => (
                  <div
                    key={index}
                    className="border  shadow-xl shadow-gray-400  rounded-xl pt-10 pb-14  px-4 max-sm:text-xs sm:text-sm max-sm:mx-3"
                  >
                    <div className="text-slate-600 font-bold sm:text-lg sm:mx-5 max-sm:text-center max-sm:mx-3 max-sm:text-lg">
                      Cek Data Penumpang Dibawah
                    </div>
                    <div className="flex mt-5 font-medium py-3 px-5 bg-black sm:w-[520px] text-white rounded-t-2xl sm:mx-5 justify-between">
                      <div className="max-sm:mt-1">Data Diri Penumpang</div>
                      <div>
                        <img src="assets/succes.png" alt="" />
                      </div>
                    </div>
                    <div className="mt-5 sm:ml-5 text-slate-600 font-semibold">
                      Title
                    </div>
                    <div className="mt-1 sm:ml-5">
                      <select
                        className="border px-2 border-gray-400 rounded sm:w-[520px] h-[40px] max-sm:w-full"
                        value={passenger.title}
                        disabled
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
                        className="border px-2 border-gray-400 text-gray-400 rounded sm:w-[520px] h-[40px] max-sm:w-full"
                        value={passenger.fullname}
                        disabled
                      />
                    </div>

                    <div className="mt-5 sm:ml-5 text-slate-600 font-semibold">
                      Nama Keluarga
                    </div>
                    <div className="mt-1 sm:ml-5">
                      <input
                        type="text"
                        className="border px-2 border-gray-400 text-gray-400 rounded sm:w-[520px] h-[40px] max-sm:w-full"
                        value={passenger.family_name}
                        disabled
                      />
                    </div>

                    <div className="mt-5 sm:ml-5 text-slate-600 font-semibold">
                      Tanggal Lahir
                    </div>
                    <div className="mt-1 sm:ml-5">
                      <input
                        type="date"
                        className="border px-2 text-gray-400 border-gray-400  rounded sm:w-[520px] h-[40px] max-sm:w-full"
                        value={formatDateForInput(passenger.birth_date)}
                        disabled
                      />
                    </div>

                    <div className="mt-5 sm:ml-5 text-slate-600 font-semibold">
                      Kewarganegaraan
                    </div>
                    <div className="mt-1 sm:ml-5">
                      <input
                        type="text"
                        className="border px-2 border-gray-400 text-gray-400 rounded sm:w-[520px] h-[40px] max-sm:w-full"
                        value={passenger.nationality}
                        disabled
                      />
                    </div>

                    <div className="mt-5 sm:ml-5 text-slate-600 font-semibold">
                      Jenis Identitas
                    </div>
                    <div className="mt-1 sm:ml-5">
                      <select
                        className="border px-2 border-gray-400 text-gray-500 rounded sm:w-[520px] h-[40px] max-sm:w-full"
                        value={passenger.identity_type}
                        disabled
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
                        className="border px-2 border-gray-400 text-gray-400 rounded sm:w-[520px] h-[40px] max-sm:w-full"
                        value={passenger.identity_number}
                        disabled
                      />
                    </div>

                    <div className="mt-5 sm:ml-5 text-slate-600 font-semibold">
                      Negara Penerbit
                    </div>
                    <div className="mt-1 sm:ml-5">
                      <input
                        type="text"
                        className="border px-2 border-gray-400 text-gray-400 rounded sm:w-[520px] h-[40px] max-sm:w-full"
                        value={passenger.issuing_country}
                        disabled
                      />
                    </div>

                    <div className="mt-5 sm:ml-5 text-slate-600 font-semibold">
                      Berlaku Sampai
                    </div>
                    <div className="mt-1 sm:ml-5">
                      <input
                        type="date"
                        className="border px-2 text-gray-400 border-gray-400 rounded sm:w-[520px] h-[40px] max-sm:w-full"
                        value={formatDateForInput(passenger.expired_date)}
                        disabled
                      />
                    </div>
                  </div>
                ))}
                <div className="mt-7 max-sm:mx-3">
                  {" "}
                  <button
                    disabled
                    className="bg-gray-400 text-white rounded-lg sm:w-[600px] sm:h-[50px] shadow-xl shadow-gray-200 max-sm:w-full max-sm:h-[40px] max-sm:mb-10 max-sm:text-xs sm:text-sm"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-sm:w-full">
            <div className="sm:w-[520px]  max-sm:text-xs max-sm:mx-3 sm:text-sm border border-gray-300 rounded p-4">
              {/* <div className="border-gray-300 border-b-2 mb-3 max-sm:-mt-3"></div> */}
              <div className="text-gray-700 flex flex-col text-left">
                <div className="font-bold mb-2 sm:text-lg text-black max-sm:text-sm">
                  Detail Penerbangan
                </div>
                <div className="flex justify-between">
                  <div>
                    <div className="font-bold">{ticket?.time_departure}</div>
                    <div>{formatDateFlight(ticket?.date_flight)}</div>
                    <div>{ticket?.city_arrive?.airport_name}</div>
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
                    <div>{ticket?.city_destination?.airport_name}</div>
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
                    {formatPrice(ticket?.totalPrice)}
                  </div>
                </div>
                <button
                  // key={order?.id}
                  // onclick={navigate("/paymentOrder", { state2: order?.id })}
                  onClick={() =>
                    navigate("/paymentOrder", { state: order?.id })
                  }
                  className="bg-green-500 p-4 sm:w-[540px] mt-5 rounded-lg font-bold text-white"
                >
                  Lanjut Bayar
                </button>
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
