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
} from "@heroicons/react/outline";
import { useNavigate } from "react-router-dom";

export default function AdminPemesanan() {
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
      current: false,
    },
    {
      name: "Penerbangan",
      href: "/admin/penerbangan",
      icon: PaperAirplaneIcon,
      current: false,
    },
    {
      name: "Pemesanan",
      href: "/admin/pemesanan",
      icon: CreditCardIcon,
      current: true,
    },
    {
      name: "Profil",
      href: "/admin/profile",
      icon: UserCircleIcon,
      current: false,
    },
  ];

  const [planes, setPlanes] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [userData, setUserData] = useState({
    countUser: 0,
    countOrder: 0,
    countFlight: 0,
  });

  const [orderHistory, setOrderHistory] = useState([]);

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
        console.log("admin count", response.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
      }
    };

    userCount();
  }, []);

  const CityCard = ({ cityName }) => (
    <div className="bg-white shadow rounded-lg p-4 m-2">
      <h3 className="text-md font-medium">{cityName}</h3>
    </div>
  );

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "https://express-development-3576.up.railway.app/api/v1/admin/all/order",
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const sortedOrders = response.data.data.sort((a, b) => a.id - b.id);
      setOrderHistory(sortedOrders);
      console.log("Order data:", response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    // ... panggilan fungsi fetch lainnya
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100";
      case "unpaid":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  const uniquePlanes = new Set(planes.map((plane) => plane.name));
  const totalUniquePlanes = uniquePlanes.size;

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div>
      <Toaster position="top-right" />
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
            <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-5">
                  <img
                    src="/assets/FlyNow.png"
                    className="h-7"
                    alt="FlyNow Logo"
                  />
                </div>
                <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                      )}
                    >
                      <item.icon
                        className={classNames(
                          item.current
                            ? "text-gray-500"
                            : "text-gray-400 group-hover:text-gray-500",
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
                <a href="#" className="flex-shrink-0 w-full group block">
                  <div className="flex items-center">
                    <div>
                      <img
                        className="inline-block h-9 w-9 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        Admin
                      </p>
                      <a
                        href="/admin/profile"
                        className="text-xs font-medium text-gray-500 group-hover:text-gray-700"
                      >
                        View profile
                      </a>
                    </div>
                  </div>
                </a>
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Pemesanan
                  </h1>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                  <div className="flex flex-col mx-auto ">
                    {/* stats */}

                    <div className="mt-8">
                      <h2 className="text-xl font-semibold mb-4">
                        Riwayat Pemesanan
                      </h2>
                      <div className="overflow-y-auto h-[800px]">
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
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
                                <span className="font-semibold">
                                  Order ID: {order.id}
                                </span>
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
                                      {
                                        order.detailFlight.flight.city_arrive
                                          .name
                                      }
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {order.detailFlight.flight.time_departure}
                                    </p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xs text-gray-500">to</p>
                                    <div className="w-20 h-px bg-gray-300 my-1"></div>
                                    <p className="text-xs text-gray-500">
                                      {
                                        order.detailFlight.flight
                                          .estimation_minute
                                      }{" "}
                                      min
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold">
                                      {
                                        order.detailFlight.flight
                                          .city_destination.name
                                      }
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
                                  Flight:{" "}
                                  {order.detailFlight.flight.flight_number}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Plane:{" "}
                                  {order.detailFlight.detailPlaneId.plane.name}
                                </p>
                                <p className="font-semibold mt-2">
                                  Price: ${order.detailFlight.price}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
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
