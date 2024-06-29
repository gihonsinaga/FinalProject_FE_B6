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
import { logout, authenticateUser } from "../redux/actions/authActions";

import Nav from "../component/Nav";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/reducers/authReducers";
import BottomNav from "../component/BottomNav";

export default function AdminPemesanan() {
  // total airplane
  // all cities
  // all countries
  // all continent
  // all user -> detail user
  // all notification

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
      current: false,
    },
    {
      name: "Profil",
      href: "/admin/profile",
      icon: UserCircleIcon,
      current: true,
    },
  ];

  const [planes, setPlanes] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [formData, setFormData] = useState({
    avatar_url: user?.data?.avatar_url || "",
    fullname: user?.data?.fullname || "",
    phoneNumber: user?.data?.phoneNumber || "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(user?.data?.avatar_url || "");

  const role = useSelector((state) => state.auth.role);
  useEffect(() => {
    if (role === "user") {
      alert("Anda bukan admin");
    }
  });
  console.log("role", role);

  useEffect(() => {
    const storedImage = localStorage.getItem("avatar_url");
    if (storedImage) {
      setFormData((prevData) => ({
        ...prevData,
        avatar_url: storedImage,
      }));
      setPreview(storedImage);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);
      setFormData((prevData) => ({
        ...prevData,
        avatar_url: file,
      }));
      setPreview(previewUrl);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  const handleSave = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("fullname", formData.fullname);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    if (formData.avatar_url instanceof File) {
      formDataToSend.append("avatar_url", formData.avatar_url);
    }

    try {
      const response = await fetch(
        "https://express-development-3576.up.railway.app/api/v1/profile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();

      console.log("Profile updated successfully:", data);
      dispatch(setUser(data));

      // Store updated avatar_url to localStorage
      localStorage.setItem("avatar_url", data.data.avatar_url);

      setFormData((prevData) => ({
        ...prevData,
        avatar_url: data.data.avatar_url,
      }));

      setPreview(data.data.avatar_url);

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      avatar_url: user?.data?.avatar_url || "",
      fullname: user?.data?.fullname || "",
      phoneNumber: user?.data?.phoneNumber || "",
    });
    setPreview(user?.data?.avatar_url || "");
    setIsEditing(false);
  };

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
                    Profil
                  </h1>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                  <div className="flex flex-col mx-auto ">
                    {/* stats */}

                    <div className="">
                      <main>
                        <div className="mx-auto px-4 py-7">
                          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-white border-b border-gray-200">
                              <div className="mt-10 sm:mt-0">
                                <div className="md:grid md:grid-cols-3 md:gap-6">
                                  <div className="bg-gray-100 border-4 rounded-xl overflow-hidden shadow-md">
                                    <div className="relative w-full h-36">
                                      <img
                                        className="relative h-full w-full object-cover blur-lg mb-14"
                                        src={user?.data?.avatar_url}
                                        alt="Profile"
                                      />
                                      <div className="absolute inset-0 flex justify-center items-center">
                                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-blue shadow-md mt-16 sm:mt-32">
                                          <img
                                            src={preview}
                                            alt="Profile"
                                            className="h-full w-full object-cover"
                                            onClick={() =>
                                              document
                                                .getElementById("avatarUpload")
                                                .click()
                                            }
                                          />
                                          {isEditing && (
                                            <input
                                              type="file"
                                              id="avatarUpload"
                                              accept="image/*"
                                              onChange={handleChange}
                                              className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="pt-12 sm:pt-20 pb-6 px-4 text-center">
                                      <h2 className="text-lg sm:text-xl font-bold text-black mb-1">
                                        {user?.data?.fullname}
                                      </h2>
                                      <p className="text-sm text-black">
                                        {user?.data?.email}
                                      </p>
                                      <p className="text-sm text-black">
                                        {user?.data?.phoneNumber}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="mt-5 md:mt-0 md:col-span-2">
                                    <div>
                                      <div className="shadow overflow-hidden sm:rounded-md">
                                        <div className="px-4 py-5 bg-white sm:p-6 bg-gray">
                                          <div className="flex justify-between mb-10">
                                            <h3 className="sm:text-lg font-medium leading-6 text-gray-900 max-sm:text-base">
                                              Data Profil
                                            </h3>
                                            {!isEditing ? (
                                              <button
                                                className="inline-flex px-4 justify-center border border-transparent shadow-sm text-md font-medium rounded-md text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                onClick={handleEdit}
                                              >
                                                Edit
                                              </button>
                                            ) : (
                                              <div className="flex space-x-4">
                                                <button
                                                  className="inline-flex px-4 justify-center border border-transparent shadow-sm text-md font-medium rounded-md text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                  onClick={handleSave}
                                                >
                                                  Save
                                                </button>
                                                <button
                                                  className="inline-flex px-4 justify-center border border-transparent shadow-sm text-md font-medium rounded-md text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                  onClick={handleCancel}
                                                >
                                                  Cancel
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                          <div className="grid grid-cols-6 gap-6">
                                            <div className="col-span-6 sm:col-span-4 mb-2">
                                              <label className="block text-xs font-medium text-gray-400 mb-1">
                                                Nama Lengkap
                                              </label>
                                              <input
                                                type="text"
                                                name="fullname"
                                                id="fullname"
                                                autoComplete="given-name"
                                                className="mt-1 cursor-pointer focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2"
                                                value={formData.fullname}
                                                onChange={handleChange}
                                                readOnly={!isEditing}
                                              />
                                            </div>

                                            <div className="col-span-6 sm:col-span-4 mb-2">
                                              <label className="block text-xs font-medium text-gray-400 mb-1">
                                                Nomor Telepon
                                              </label>
                                              <input
                                                type="text"
                                                name="phoneNumber"
                                                id="phoneNumber"
                                                autoComplete="tel"
                                                className="mt-1 cursor-pointer focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2"
                                                value={formData.phoneNumber}
                                                onChange={handleChange}
                                                readOnly={!isEditing}
                                              />
                                            </div>

                                            <div className="col-span-6 sm:col-span-4 mb-2">
                                              <label className="block text-xs font-medium text-gray-400 mb-1">
                                                Email
                                              </label>
                                              <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                autoComplete="email"
                                                className="mt-1 cursor-pointer focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2"
                                                value={user?.data?.email}
                                                readOnly
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-end justify-end self-end mt-10">
                                      <button
                                        onClick={handleLogout}
                                        className="flex py-3 px-5 mr-3 font-normal text-sm text-white border-white bg-blue-500 rounded-md"
                                      >
                                        Logout
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </main>
                    </div>
                  </div>

                  {/* /End replace */}
                </div>
              </div>
            </main>
            <Footer />
          </div>
        </div>
      </>
    </div>
  );
}
