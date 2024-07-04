import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, authenticateUser } from "../redux/actions/authActions";

export default function Nav({ isHomePage }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [scrolled, setScrolled] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    dispatch(authenticateUser());
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  const location = useLocation();
  const handleNotificationClick = () => {
    navigate("/notifikasi");
  };

  const handleHistory = () => {
    navigate("/history");
  };

  const handleSettings = () => {
    navigate("/changepassword");
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 ${
          isHomePage
            ? scrolled
              ? "bg-white shadow-md"
              : "bg-transparent"
            : "bg-white shadow-md"
        } transition-colors duration-300 hidden md:block`}
      >
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="#"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src="/assets/FlyNow.svg" className="h-8" alt="FlyNow Logo" />
          </a>

          <div
            className={`flex py-3 px-5 mr-3 font-normal text-sm ${
              isHomePage
                ? scrolled
                  ? "text-slate-900"
                  : "text-white"
                : "text-slate-900"
            } transition-colors duration-300`}
          >
            <a onClick={() => navigate("/")} className="cursor-pointer">
              Beranda
            </a>
            <a
              onClick={() => navigate("/plane")}
              className="mx-10 cursor-pointer"
            >
              Pesawat
            </a>
            <a onClick={() => navigate("/about-us")} className="cursor-pointer">
              Tentang Kami
            </a>
          </div>

          {isLoggedIn ? (
            <div className="relative flex flex-row justify-center items-center gap-4">
              <div onClick={handleNotificationClick} className="cursor-pointer">
                {isHomePage ? (
                  scrolled ? (
                    // Ikon biru untuk homepage yang sudah di-scroll
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#535f6b"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    // Ikon putih untuk homepage yang belum di-scroll
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="white"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                      />
                    </svg>
                  )
                ) : (
                  // Ikon biru untuk halaman lain
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#535f6b"
                    className="size-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>

              <div onClick={toggleDropdown} className="relative cursor-pointer">
                {isHomePage ? (
                  scrolled ? (
                    // Ikon biru untuk homepage yang sudah di-scroll
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#535f6b"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    // Ikon putih untuk homepage yang belum di-scroll
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="white"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  )
                ) : (
                  // Ikon biru untuk halaman lain
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#535f6b"
                    className="size-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}

                {dropdownVisible && (
                  <div
                    className="absolute mt-2 py-2 w-40 bg-white rounded-md shadow-lg z-20"
                    style={{ left: "-135px", top: "35px" }}
                  >
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200 sm:text-sm"
                    >
                      Profile
                    </a>
                    <a
                      onClick={handleSettings}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200 sm:text-sm"
                    >
                      Settings
                    </a>
                    <a
                      onClick={handleHistory}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200 sm:text-sm"
                    >
                      History
                    </a>
                    <a
                      onClick={handleLogout}
                      className="block px-4 py-2 text-red-500 hover:bg-gray-200 cursor-pointer sm:text-sm"
                    >
                      Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              className="hidden w-full md:block md:w-auto"
              id="navbar-default"
            >
              <div className="flex">
                <button
                  onClick={
                    () =>
                      navigate("/Login", { state: { from: location.pathname } }) // ambil pathname agar login dynamic
                  }
                  className={`flex py-3 px-5 mr-3 font-normal text-sm ${
                    isHomePage
                      ? scrolled
                        ? "text-slate-700 border-slate-700"
                        : "text-white border-white"
                      : "text-slate-700 border-slate-700"
                  } bg-transparent border rounded-xl transition-colors duration-300`}
                >
                  Masuk
                </button>
                <button
                  onClick={() => navigate("/Register")}
                  className="flex py-3 px-5 font-normal text-sm text-white bg-slate-600 rounded-xl"
                >
                  Daftar
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 md:hidden max-sm:text-xs ${
          scrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="flex justify-between items-center p-4 ">
          <a
            href="#"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="/assets/FlyNow.svg"
              className="h-[20px] w-[70px] mt-2"
              alt="FlyNow Logo"
            />
          </a>
          <button onClick={toggleMobileMenu} className="text-slate-900">
            {mobileMenuVisible ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        <div
          className={`fixed top-0 right-0 h-full w-2/3 bg-white shadow-2xl transition-transform duration-300 transform ${
            mobileMenuVisible ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-end p-4">
            <button onClick={toggleMobileMenu} className="text-slate-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="#535f6b"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="border-gray-400 border-b my-3 sm:hidden "></div>

          <div className="px-4 pt-2 pb-4">
            <a
              onClick={() => {
                navigate("/");
                toggleMobileMenu();
              }}
              className="block py-2 text-slate-900"
            >
              Beranda
            </a>
            <a
              onClick={() => {
                navigate("/plane");
                toggleMobileMenu();
              }}
              className="block py-2 text-slate-900"
            >
              Pesawat
            </a>
            <a
              onClick={() => {
                navigate("/about-us");
                toggleMobileMenu();
              }}
              className="block py-2 text-slate-900"
            >
              Tentang Kami
            </a>
            <div className="border-gray-400 border-b my-3 sm:hidden "></div>

            {isLoggedIn ? (
              <>
                <a
                  onClick={() => {
                    navigate("/profile");
                    toggleMobileMenu();
                  }}
                  className="block py-2 text-slate-900"
                >
                  Profile
                </a>

                <a
                  onClick={() => {
                    handleHistory();
                    toggleMobileMenu();
                  }}
                  className="block py-2 text-slate-900"
                >
                  Riwayat
                </a>

                <a
                  onClick={() => {
                    handleNotificationClick();
                    toggleMobileMenu();
                  }}
                  className="block py-2 text-slate-900"
                >
                  Notifikasi
                </a>
                <a
                  onClick={() => {
                    handleSettings();
                    toggleMobileMenu();
                  }}
                  className="block py-2 text-slate-900"
                >
                  Pengaturan
                </a>
                <a
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className="fixed bottom-4 left-4 right-4 block py-2 text-red-800 border border-red-800 text-center text-xs"
                >
                  Logout
                </a>
                <div className="border-gray-300 border-b-2 my-3 sm:hidden mx-36"></div>
              </>
            ) : (
              <div className="fixed bottom-4 left-4 right-2 flex justify-end ">
                <div
                  onClick={() => {
                    navigate("/Login", {
                      state: { from: location.pathname },
                    });
                    toggleMobileMenu();
                  }}
                  className="block  mr-2 py-2 text-slate-900 text-xs border-slate-700 border p-4 "
                >
                  Masuk
                </div>

                <div
                  onClick={() => {
                    navigate("/Register");
                    toggleMobileMenu();
                  }}
                  className="block py-2 text-white text-xs border-slate-700 border p-4 bg-slate-700 "
                >
                  Daftar
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
