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
import { CalendarIcon, UsersIcon } from "@heroicons/react/solid";
import {
  UserCircleIcon,
  HomeIcon,
  MenuIcon,
  PaperAirplaneIcon,
  XIcon,
  CreditCardIcon,
  BellIcon,
  PlusIcon,
} from "@heroicons/react/outline";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/actions/authActions";

export default function AdminPage() {
  const navigate = useNavigate();
  // total airplane
  // all cities
  // all countries
  // all continent
  // all user -> detail user
  // all notification

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: HomeIcon, current: true },
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
      current: false,
    },
    {
      name: "Pesawat",
      href: "/admin/pesawat",
      icon: PaperAirplaneIcon,
      current: false,
    },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const role = useSelector((state) => state.auth.role);
  useEffect(() => {
    if (role === "user") {
      alert("Anda bukan admin");
      navigate("/");
    }
  });
  // console.log("role", role);

  const [planes, setPlanes] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [userOrderHistory, setUserOrderHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const tableRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const notifications = useSelector(
    (state) => state.notifications.notifications
  );

  const [userData, setUserData] = useState({
    countUser: 0,
    countOrder: 0,
    countFlight: 0,
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const Notification = ({
    notificationId,
    title,
    message,
    createdAt,
    isRead,
  }) => {
    const dispatch = useDispatch();

    const handleClick = () => {
      dispatch(updateNotificationStatus(notificationId));
    };

    return (
      <div
        className={`bg-white border shadow-md overflow-hidden sm:rounded-md mb-2  ${
          isRead ? "" : "border-blue-500 "
        }`}
        onClick={handleClick}
      >
        <ul role="list" className="divide-y divide-gray-200">
          <li>
            <a
              href="#"
              className={`block  ${
                isRead ? "" : "bg-[#EFF7FF] "
              }  hover:bg-gray-50 ${isRead ? "text-gray-500" : ""}`}
            >
              <div className="flex items-start px-4 py-4 sm:px-6">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-shrink-0 mr-4"
                >
                  <path
                    d="M15 24.75C15.625 24.75 16.156 24.531 16.593 24.093C17.031 23.656 17.25 23.125 17.25 22.5H12.75C12.75 23.125 12.969 23.656 13.407 24.093C13.844 24.531 14.375 24.75 15 24.75ZM7.5 21H22.5V18H21V14.1C21 12.575 20.6065 11.181 19.8195 9.918C19.0315 8.656 17.925 7.85 16.5 7.5V5.25H13.5V7.5C12.075 7.85 10.969 8.656 10.182 9.918C9.394 11.181 9 12.575 9 14.1V18H7.5V21ZM15 30C12.925 30 10.975 29.606 9.15 28.818C7.325 28.031 5.7375 26.9625 4.3875 25.6125C3.0375 24.2625 1.969 22.675 1.182 20.85C0.394 19.025 0 17.075 0 15C0 12.925 0.394 10.975 1.182 9.15C1.969 7.325 3.0375 5.7375 4.3875 4.3875C5.7375 3.0375 7.325 1.9685 9.15 1.1805C10.975 0.3935 12.925 0 15 0C17.075 0 19.025 0.3935 20.85 1.1805C22.675 1.9685 24.2625 3.0375 25.6125 4.3875C26.9625 5.7375 28.031 7.325 28.818 9.15C29.606 10.975 30 12.925 30 15C30 17.075 29.606 19.025 28.818 20.85C28.031 22.675 26.9625 24.2625 25.6125 25.6125C24.2625 26.9625 22.675 28.031 20.85 28.818C19.025 29.606 17.075 30 15 30Z"
                    fill="#2193FA"
                  />
                </svg>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-md font-bold truncate">{title}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 pr-3">
                        <CalendarIcon
                          className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <p>
                          <time dateTime={createdAt}>
                            {formatDate(createdAt)}
                          </time>
                        </p>
                      </div>
                      {!isRead && (
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          New
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm font-semibold text-gray-500">
                        {message}
                      </p>
                    </div>
                  </div>
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500 pt-1 truncate">
                      {message}
                    </p>
                  </div>
                </div>
              </div>
            </a>
          </li>
        </ul>
      </div>
    );
  };

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
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://express-development-3576.up.railway.app/api/v1/admin/all/user",
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
        `https://express-development-3576.up.railway.app/api/v1/admin/all/user`,
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
        `https://express-development-3576.up.railway.app/api/v1/admin/order/user/${userId}`,
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
              return `<button class="detail-button bg-blue-400 hover:bg-blue-500 text-white font-regular py-2 px-4 rounded" data-id="${row.id}">Detail</button>`;
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
        setLoading(false);
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
        setLoading(false);
      }
    };

    userCount();
  }, []);

  const uniquePlanes = new Set(planes.map((plane) => plane.name));
  const totalUniquePlanes = uniquePlanes.size;
  const stats = [
    {
      name: "Total Pengguna",
      stat: userData.countUser,
    },
    {
      name: "Total Pemesanan",
      stat: userData.countOrder,
    },
    {
      name: "Total Penerbagan",
      stat: userData.countFlight,
    },
    {
      name: "Total Pesawat",
      stat: totalUniquePlanes,
    },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(postNotification({ title, message }))
      .then(() => {
        toast.success("Notifikasi berhasil ditambahkan");
        setShowForm(false);
        setTitle("");
        setMessage("");
        return dispatch(fetchNotifications());
      })
      .catch((error) => {
        // console.error("Error adding notification:", error);
        toast.error("Gagal menambahkan notifikasi");
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

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
                        src="/assets/LogoFlyNow.svg"
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
                <div className="max-w-7xl mx-auto px-4 ">
                  <h1 className="text-4xl  text-slate-700 font-medium ml-7">
                    Dashboard
                  </h1>
                </div>
                {/* <div className="border-slate-300 border-b-2 mt-4  mx-10 "></div> */}

                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 mt-2">
                  <div className="flex flex-col mx-auto ">
                    {/* Graphs */}
                    <div className="flex flex-col md:flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 mt-6 ">
                      <div className="flex-1 items-center bg-slate-100 justify-center align-center p-5 shadow-md rounded-lg border lg:hover:scale-95 lg:transition-transform lg:duration-200">
                        <h2 className="text-lg font-semibold mb-2 ">
                          Distribusi Jenis Pesawat
                        </h2>
                        <div className="w-full h-64 md:h-80 ml-6 lg:ml-20 ">
                          <PlanePieChart planes={planes.slice(0, 20)} />
                        </div>
                      </div>
                      <div className="flex-1 w-full border p-5 bg-slate-100 shadow-md rounded-lg lg:hover:scale-95 lg:transition-transform lg:duration-200">
                        <h2 className="text-lg font-semibold mb-2">
                          Statistik Pemesanan Pesawat
                        </h2>
                        <div className="w-full h-64 md:h-80 ">
                          <PlaneOrderHistogram />
                        </div>
                      </div>
                    </div>

                    {/* stats */}
                    <div className="">
                      <dl className="mt-5 grid grid-cols-1 rounded-lg bg-slate-50 overflow-hidden border divide-y shadow-md items-center divide-gray-200 md:grid-cols-4 md:divide-y-0 md:divide-x ">
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

                    {/* notifications */}
                    {/* <div className="border rounded-md shadow-md mt-5 p-5">
                      <div className="flex flex-row justify-between items-center mb-3 mt-3">
                        <h2 className="text-lg font-semibold">Notifikasi</h2>
                        <button
                          className="bg-blue-400 hover:bg-blue-500 text-white font-small py-2 px-3 rounded"
                          onClick={() => setShowForm(true)}
                        >
                          Tambah Notifikasi
                        </button>
                      </div>

                      {showForm && (
                        <div className="fixed inset-0 z-20 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                          <div className="bg-white p-5 rounded-lg">
                            <h2 className="text-xl mb-4">Tambah Notifikasi</h2>
                            <form onSubmit={handleSubmit}>
                              <input
                                type="text"
                                placeholder="Judul"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2 mb-4 border rounded"
                              />
                              <textarea
                                placeholder="Pesan"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full p-2 mb-4 border rounded"
                              />
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => setShowForm(false)}
                                  className="mr-2 px-4 py-2 bg-gray-300 rounded"
                                >
                                  Batal
                                </button>
                                <button
                                  type="submit"
                                  className="px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                  Kirim
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      )}
                      <div className="overflow-y-auto h-[300px] my-8">
                        {sortedNotifications.map((notification) => (
                          <Notification
                            key={notification.id}
                            notificationId={notification.id}
                            title={notification.title}
                            message={notification.message}
                            createdAt={notification.createdAt}
                            isRead={notification.isRead}
                          />
                        ))}
                      </div>
                    </div> */}

                    {/* datatables */}
                    {/* <div className="container mx-auto px-4 sm:px-0 max-w-full  border rounded-md shadow-md mt-5">
                      <div className="p-5 ">
                        <div className="text-black font-semibold text-xl ">
                          Users
                        </div>
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
                            <tbody></tbody>
                          </table>
                        </div>
                      </div>
                    </div> */}

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
