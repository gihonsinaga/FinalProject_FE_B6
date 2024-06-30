import React, { useEffect, useState } from "react";
import "../index.css";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "../component/Nav";
import Search from "../component/Search";
import "react-responsive-modal/styles.css";
import toast, { Toaster } from "react-hot-toast";
// import { Modal } from "react-responsive-modal";
// import clsx from "clsx";
import { FcSearch } from "react-icons/fc"; // Import FcSearch
import { MdOutlineSearch } from "react-icons/md"; // Import MdOutlineSearch
import { useDispatch, useSelector } from "react-redux";
import {
  updateSearchQuery,
  updateFilterValue,
  fetchNotificationsPage,
} from "../redux/actions/notificationAction";
import {
  fetchNotifications,
  postNotification,
  updateNotificationStatus,
  updateAllNotificationStatus,
} from "../redux/actions/notificationAction";

import Modal from "react-modal";
import {
  CalendarIcon,
  LocationMarkerIcon,
  UsersIcon,
} from "@heroicons/react/solid";
import BottomNav from "../component/BottomNav";
import Footer from "../component/Footer";

export default function Notifikasi() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const notifications = useSelector(
    (state) => state.notifications.notifications
  );

  const searchQuery = useSelector((state) => state.notifications.searchQuery);
  const filterValue = useSelector((state) => state.notifications.filterValue);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch, searchQuery, filterValue]);

  const handleSearchChange = (event) => {
    dispatch(updateSearchQuery(event.target.value));
  };

  const handleFilterChange = (event) => {
    dispatch(updateFilterValue(event.target.value));
  };

  // console.log("notifications", notifications);
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleClickAll = () => {
    dispatch(updateAllNotificationStatus()).then(() => {
      dispatch(fetchNotifications());
    });
  };

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
                  className="flex-shrink-0 mr-4 max-sm:hidden"
                >
                  <path
                    d="M15 24.75C15.625 24.75 16.156 24.531 16.593 24.093C17.031 23.656 17.25 23.125 17.25 22.5H12.75C12.75 23.125 12.969 23.656 13.407 24.093C13.844 24.531 14.375 24.75 15 24.75ZM7.5 21H22.5V18H21V14.1C21 12.575 20.6065 11.181 19.8195 9.918C19.0315 8.656 17.925 7.85 16.5 7.5V5.25H13.5V7.5C12.075 7.85 10.969 8.656 10.182 9.918C9.394 11.181 9 12.575 9 14.1V18H7.5V21ZM15 30C12.925 30 10.975 29.606 9.15 28.818C7.325 28.031 5.7375 26.9625 4.3875 25.6125C3.0375 24.2625 1.969 22.675 1.182 20.85C0.394 19.025 0 17.075 0 15C0 12.925 0.394 10.975 1.182 9.15C1.969 7.325 3.0375 5.7375 4.3875 4.3875C5.7375 3.0375 7.325 1.9685 9.15 1.1805C10.975 0.3935 12.925 0 15 0C17.075 0 19.025 0.3935 20.85 1.1805C22.675 1.9685 24.2625 3.0375 25.6125 4.3875C26.9625 5.7375 28.031 7.325 28.818 9.15C29.606 10.975 30 12.925 30 15C30 17.075 29.606 19.025 28.818 20.85C28.031 22.675 26.9625 24.2625 25.6125 25.6125C24.2625 26.9625 22.675 28.031 20.85 28.818C19.025 29.606 17.075 30 15 30Z"
                    fill="#535f6b"
                  />
                </svg>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-md font-bold truncate">{title}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <div className="mt-2 sm:flex max-sm:hidden items-center max-sm:text-[10px] sm:text-xs text-gray-500 sm:mt-0 pr-3">
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
                        <p className="px-2 inline-flex max-sm:text-[10px] sm:text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          New
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="sm:mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center max-sm:text-[10px] sm:text-xs font-semibold text-gray-500 max-sm:w-[full]">
                        {message}
                      </p>
                    </div>
                  </div>
                  <div className="sm:flex">
                    <p className="flex items-center max-sm:text-[10px] sm:text-xs text-gray-500 sm:pt-1 truncate  max-sm:w-[150px]">
                      {message}
                    </p>
                  </div>
                  <div className="mt-2 sm:hidden flex items-center max-sm:text-[10px] sm:text-xs text-gray-500 sm:mt-0 pr-3">
                    <CalendarIcon
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <p>
                      <time dateTime={createdAt}>{formatDate(createdAt)}</time>
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

  const [showSearch, setShowSearch] = useState(false);
  // const [searchQuery, setSearchQuery] = useState("");

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
  };

  // const handleSearchChange = (e) => {
  //   setSearchQuery(e.target.value);
  // };

  const [currentPage, setCurrentPage] = useState(1);
  // console.log("currentPage", currentPage);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchNotifications(currentPage));
  }, [currentPage, dispatch]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setIsLoading(true);
    dispatch(fetchNotificationsPage(newPage))
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));
  };

  return (
    <div className="">
      {/* <Toaster position="top-right" /> */}
      <div className=" max-sm:h-[60px] ">
        <Nav isHomePage={false} />
        {/* <div className="container flex flex-col justify-center p-6 sm:py-12 sm:px-40 lg:py-20 lg:flex-row lg:justify-between"></div> */}
      </div>

      <div className="flex flex-col mx-auto sm:px-40 sm:mt-20">
        <div className="flex justify-between max-sm:text-xs">
          <div className="flex sm:mt-10  font-semibold items-center sm:p-4 max-sm:p-3  bg-slate-500 sm:w-[1350px]  text-white  max-sm:w-full">
            <div className="flex sm:text-base">
              <div className="sm:mr-7 max-sm:mr-3">
                <button onClick={() => navigate("/")} className="">
                  ←
                </button>
              </div>
              <div>Beranda</div>
            </div>
          </div>
          <div className="relative">
            <div>
              <button
                onClick={handleSearchClick}
                className="bg-white border-slate-600 border font-semibold  text-slate-600 mt-10 py-5 px-14 max-sm:hidden sm:text-base"
              >
                search
              </button>
              <button
                onClick={handleSearchClick}
                className=" text-white font-medium border sm:rounded-2xl sm:px-10 max-sm:px-3 sm:hidden sm:ml-2 sm:py-4 max-sm:py-3 sm:text-lg max-sm:-ml-10 max-sm:bg-white max-sm:border-slate-600 max-sm:text-slate-600"
              >
                search
              </button>
            </div>
          </div>
        </div>

        {/* sorting fitur */}
        <div>
          {/* <div className="border-gray-300 border-b-2 mb-1 mt-1 px-40"></div> */}

          <div className="flex flex-col lg:flex-row lg:justify-between w-full max-w-[690px] lg:max-w-[1400px] my-3 lg:gap-2">
            {showSearch && (
              <div className="relative sm:mt-5 text-gray-600 w-full lg:max-w-[300px] mb-4 lg:mb-0 lg:self-start max-sm:px-10  ">
                <input
                  type="search"
                  name="search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="border-2 border-gray-500  bg-white w-full py-2 px-5 pr-16 rounded-3xl text-sm max-sm:text-[10px] focus:outline-none focus:border-blue-500"
                  placeholder="Search"
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 max-sm:hidden"
                >
                  <svg
                    className="text-gray-600 h-5 w-5 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 56.966 56.966"
                  >
                    <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17s-17-7.626-17-17S14.61,6,23.984,6z" />
                  </svg>
                </button>
              </div>
            )}
            <div className="sm:hidden sm:flex-col lg:flex-row gap-4 w-full px-5 lg:w-auto max-sm:text-xs">
              {/* <div className="border-gray-300 border-b-2 sm:hidden mx-32 mb-2 mt-5"></div> */}

              <div className="flex justify-center sm:mt-5 max-sm:mt-2 max-sm:justify-center">
                <button
                  className="border text-white sm:text-sm bg-slate-500 sm:rounded-full w-full py-2 sm:mr-5 text-[10px] max-sm:mb-2 h-10"
                  onClick={handleClickAll}
                >
                  <span>Mark All As Read</span>
                </button>
                <select
                  value={filterValue}
                  onChange={handleFilterChange}
                  className="border text-white text-[10px] bg-slate-500 sm:rounded-full w-full text-center h-10"
                >
                  <option value="">All</option>
                  <option value="welcome">Welcome</option>
                  <option value="password">Password</option>
                  <option value="order">Order</option>
                  <option value="payment">Payment</option>
                  <option value="notification">Notification</option>
                </select>
              </div>
            </div>
            <div className="max-sm:hidden sm:mt-5 lg:flex sm:flex-col lg:flex-row gap-4 w-full lg:w-auto ">
              <button
                className="bg-white text-slate-500   py-2 px-2  font-medium text-xs border-b border-gray-400 hover:bg-white hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-gray-500 sm:w-full max-sm:w-[100px] lg:w-[130px] "
                onClick={handleClickAll}
              >
                <span>Mark All As Read</span>
              </button>
              <select
                value={filterValue}
                onChange={handleFilterChange}
                className="bg-white text-slate-500  py-2 px-4 font-medium text-xs border-b border-gray-400 hover:bg-white focus:outline-none focus:ring-2 focus:ring-gray-500 sm:w-full max-sm:w-[100px] lg:w-[130px]"
              >
                <option value="">All</option>
                <option value="welcome">Welcome</option>
                <option value="password">Password</option>
                <option value="order">Order</option>
                <option value="payment">Payment</option>
                <option value="notification">Notification</option>
              </select>
            </div>
          </div>

          <div className=" sm:mt-5 text-sm max-sm:px-5 max-sm:-mt-2">
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
          {/* Pagination */}
          <div className="max-sm:flex max-sm:justify-end">
            <div className="flex justify-end items-center sm:mt-10 max-sm:mr-5 max-sm:mt-2 max-sm:mb-20 ">
              <button
                disabled={currentPage === 1 || isLoading}
                onClick={() => handlePageChange(currentPage - 1)}
                className="sm:px-3 sm:py-1 max-sm:px-3 max-sm:py-1 bg-slate-500 text-white "
              >
                <span>{"<"}</span>
              </button>
              <span className="sm:mx-4 max-sm:mx-3 font-medium max-sm:text-xs  sm:text-xs">
                {currentPage}
              </span>
              <button
                disabled={isLoading}
                onClick={() => handlePageChange(currentPage + 1)}
                className="sm:px-3 sm:py-1 max-sm:px-3 max-sm:py-1 bg-slate-500 text-white "
              >
                <span>{">"}</span>
              </button>
            </div>
          </div>
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
