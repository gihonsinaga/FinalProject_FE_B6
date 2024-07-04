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
import { logout } from "../redux/actions/authActions";

export default function AdminPengguna() {
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
  const navigation = [
    { name: "Dashboard", href: "/admin", icon: HomeIcon, current: false },
    {
      name: "Pengguna",
      href: "/admin/pengguna",
      icon: UsersIcon,
      current: true,
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
      current: false,
    },
    {
      name: "Pesawat",
      href: "/admin/pesawat",
      icon: PaperAirplaneIcon,
      current: false,
    },
  ];

  const token = useSelector((state) => state.auth.token);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [userOrderHistory, setUserOrderHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const tableRef = useRef(null);

  const Modal = ({ isOpen, onClose, userDetails, orderHistory }) => {
    if (!isOpen) return null;

    const getStatusColor = (status) => {
      return status.toLowerCase() === "paid" ? "bg-green-600" : "bg-red-600";
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-5xl w-full max-h-[80vh] overflow-y-auto ">
          <h2 className="text-2xl font-bold mb-4">User Details</h2>
          <p>
            <strong>Name:</strong> {userDetails.fullname}
          </p>
          <p>
            <strong>Email:</strong> {userDetails.email}
          </p>
          <p>
            <strong>Phone:</strong> {userDetails.phoneNumber}
          </p>

          <h3 className="text-xl font-bold mt-6 mb-4">Order History</h3>
          <div className="overflow-y-auto h-[260px]">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4  ">
              {orderHistory.map((order, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md border rounded-lg overflow-hidden"
                >
                  <div
                    className={`text-black px-4 py-2 flex justify-between items-center ${getStatusColor(
                      order.status
                    )}`}
                  >
                    <span className="font-semibold">Order ID: {order.id}</span>
                    <span className={`text-sm px-2 py-1 rounded`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Code: {order.code}
                    </p>
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="font-semibold">
                          {order.detailFlight.flight.city_arrive.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.detailFlight.flight.time_departure}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">to</p>
                        <div className="w-20 h-px bg-gray-300 my-1"></div>
                        <p className="text-xs text-gray-500">
                          {order.detailFlight.flight.estimation_minute} min
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {order.detailFlight.flight.city_destination.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.detailFlight.flight.time_arrive}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Date: {order.detailFlight.flight.date_flight}
                    </p>
                    <p className="text-sm text-gray-600">
                      Flight: {order.detailFlight.flight.flight_number}
                    </p>
                    <p className="text-sm text-gray-600">
                      Plane: {order.detailFlight.detailPlaneId.plane.name}
                    </p>
                    <p className="font-semibold mt-2">
                      Price: ${order.detailFlight.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-6 bg-slate-600 text-white flex px-4 py-2 rounded hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://expressjs-production-53af.up.railway.app/api/v1/admin/all/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status) {
          setUsers(response.data.data);
          // console.log("first", response.data.data);
        }
      } catch (error) {
        // console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const fetchUserDetails = async (userId) => {
    try {
      const userResponse = await axios.get(
        `https://expressjs-production-53af.up.railway.app/api/v1/admin/all/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const selectedUser = userResponse.data.data.find(
        (user) => user.id === userId
      );

      const orderResponse = await axios.get(
        `https://expressjs-production-53af.up.railway.app/api/v1/admin/order/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (selectedUser && orderResponse.data.status) {
        setSelectedUserDetails(selectedUser);
        setUserOrderHistory(orderResponse.data.data);
        setIsModalOpen(true);
      }
    } catch (error) {
      // console.error("Error fetching user details", error);
    }
  };

  useEffect(() => {
    if (users.length > 0) {
      const table = $("#usersTable").DataTable({
        data: users,
        columns: [
          { data: "fullname", title: "Nama" },
          { data: "email", title: "EMAIL" },
          { data: "phoneNumber", title: "No. Telepon" },
          {
            data: null,
            title: "Aksi",
            render: function (data, type, row) {
              return `<button class="detail-button bg-slate-500 hover:bg-slate-600 text-white font-regular py-2 px-4 rounded" data-id="${row.id}">Detail</button>`;
            },
          },
        ],
        dom: '<"flex items-center justify-between mb-4"<"flex items-center"l><"flex items-center gap-4"f>>t<"flex items-center justify-between mt-4"<"flex items-center gap-10"i><"flex items-center gap-2"p>>',
        language: {
          lengthMenu: "Show _MENU_",
          info: "Showing _START_ to _END_ of _TOTAL_ entries",
          paginate: {
            first: "<span style='margin-right: 5px;'>&lt;&lt;</span>",
            previous: "<span style='margin-right: 5px;'>&lt;</span>",
            next: "<span style='margin-left: 5px;'>&gt;</span>",
            last: "<span style='margin-left: 5px;'>&gt;&gt;</span>",
          },
        },
        pagingType: "simple",

        drawCallback: function () {
          $(".paginate_button").addClass(
            "px-3 py-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md mx-4"
          );
          $(".paginate_button.current").addClass(
            "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
          );
          $(".paginate_button.disabled").addClass(
            "opacity-50 cursor-not-allowed"
          );

          $(".detail-button")
            .off("click")
            .on("click", function () {
              const userId = $(this).data("id");
              fetchUserDetails(userId);
            });
        },
      });

      tableRef.current = table;

      // Custom pagination button text
      const updatePaginationButtons = () => {
        $(".dataTables_paginate .paginate_button").each(function () {
          if ($(this).hasClass("previous")) {
            $(this).html("previous");
          } else if ($(this).hasClass("next")) {
            $(this).html("next");
          } else if ($(this).hasClass("first")) {
            $(this).html("<<");
          } else if ($(this).hasClass("last")) {
            $(this).html(">>");
          }
        });
      };

      // Initial update
      updatePaginationButtons();

      // Update on each draw
      table.on("draw", updatePaginationButtons);

      // Clean up function
      return () => {
        table.off("draw", updatePaginationButtons);
        table.destroy();
      };
    }
  }, [users]);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  return (
    <div>
      <div>
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
                    Pengguna
                  </h1>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
                  <div className="flex flex-col mx-auto ">
                    {/* datatables */}
                    <div className="container mx-auto px-4 sm:px-0 max-w-full  border rounded-md shadow-m mt-5">
                      <div className="p-5 ">
                        <div className="text-black font-semibold text-xl "></div>
                        <div className="flex flex-row mb-1 sm:mb-0 justify-between w-full"></div>
                        <div className="my-4 overflow-x-auto bg-white rounded-lg">
                          <table
                            id="usersTable"
                            className="min-w-full leading-normal"
                          >
                            <thead>
                              <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                  Nama
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                  Email
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                  No. Telepon
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                  Aksi
                                </th>
                              </tr>
                            </thead>
                            <tbody>{/* DataTables will populate this */}</tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* modal */}
                    <Modal
                      isOpen={isModalOpen}
                      onClose={() => setIsModalOpen(false)}
                      userDetails={selectedUserDetails}
                      orderHistory={userOrderHistory}
                    />
                  </div>

                  {/* /End replace */}
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
