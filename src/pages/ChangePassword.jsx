import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Nav from "../component/Nav";

export default function ChangePassword() {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");

  useEffect(() => {
    if (token == null) {
      toast.error("Please login first");
      setTimeout(() => {
        navigate("/login");
      }, 20);
    }
  }, [token, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!oldPassword || !newPassword || !newPasswordConfirmation) {
      toast.error("Semua kolom harus diisi.");
      return;
    }

    if (newPassword !== newPasswordConfirmation) {
      toast.error("Kata sandi tidak cocok!");
      return;
    }

    try {
      const response = await fetch(
        "https://expressjs-production-53af.up.railway.app/api/v1/profile/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
            newPasswordConfirmation,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Kata sandi Anda berhasil diubah.");
        setOldPassword("");
        setNewPassword("");
        setNewPasswordConfirmation("");
        // setTimeout(() => {
        //   navigate('/');
        // }, 3000);
      } else {
        if (response.status === 400) {
          toast.error(
            data.message ||
              "Bad request due to missing fields or invalid password format"
          );
        } else if (response.status === 401) {
          toast.error("Unauthorized if the old password is incorrect.");
        } else if (response.status === 404) {
          toast.error("User not found.");
        } else {
          toast.error(data.message || "There is an error.");
        }
      }
    } catch (error) {
      // console.error("Network error:", error);
      toast.error("Failed to connect to server.");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="text-xs">
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
      <div className=" max-sm:h-[60px] ">
        <Nav isHomePage={false} />
        {/* <div className="container flex flex-col justify-center p-6 sm:py-12 sm:px-40 lg:py-20 lg:flex-row lg:justify-between"></div> */}
      </div>
      <div className="container mx-auto sm:px-6 lg:px-36  sm:py-24 lg:py-32 max-sm:text-xs  max-sm:pb-20">
        <header>
          <div className="mx-auto sm:px-4">
            <div className="mb-4 flex justify-between py-2 max-sm:w-full">
              <button
                className="w-full text-left font-bold bg-slate-500 text-white  px-4 py-2 sm:py-3 lg:py-4 max-sm:text-base"
                onClick={() => navigate("/")}
              >
                ←{" "}
                <span className="sm:ml-7 max-sm:ml-3 max-sm:text-sm">
                  {" "}
                  Beranda{" "}
                </span>
              </button>
            </div>
          </div>
        </header>
        <main>
          <div className="mx-auto px-4">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6 bg-white border-b border-gray-200">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                  {/* Avatar Card */}
                  <div className="bg-slate-300 border-4 rounded-xl overflow-hidden shadow-md">
                    <div className="relative w-full h-36">
                      <img
                        className="relative h-full w-full object-cover blur-lg mb-14"
                        src={user?.data?.avatar_url}
                        // alt="Profile"
                      />
                      <div className="absolute inset-0 flex justify-center items-center">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-md mt-16 sm:mt-32">
                          <img
                            src={user?.data?.avatar_url}
                            // alt="Profile"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="pt-12 sm:pt-20 pb-6 px-4 text-center">
                      <h2 className="text-lg sm:text-xl font-bold text-black mb-1">
                        {user?.data?.fullname}
                      </h2>
                      <p className="text-sm text-black">{user?.data?.email}</p>
                      <p className="text-sm text-black">
                        {user?.data?.phoneNumber}
                      </p>
                    </div>
                  </div>
                  {/* Password Change Form */}
                  <div className="mt-5 md:mt-0 md:col-span-2">
                    <form onSubmit={handleSubmit}>
                      <div className="shadow overflow-hidden sm:rounded-md">
                        <div className="px-4 py-5 bg-white sm:p-6 bg-gray">
                          <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-4 mb-2">
                              <label className="block text-xs font-medium text-gray-400 mb-1">
                                Password Lama
                              </label>
                              <input
                                type="password"
                                name="oldPassword"
                                id="oldPassword"
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                              />
                            </div>

                            <div className="col-span-6 sm:col-span-4 mb-2">
                              <label className="block text-xs font-medium text-gray-400 mb-1">
                                Password Baru
                              </label>
                              <input
                                type="password"
                                name="newPassword"
                                id="newPassword"
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                              />
                            </div>

                            <div className="col-span-6 sm:col-span-4 mb-2">
                              <label className="block text-xs font-medium text-gray-400 mb-1">
                                Konfirmasi Password Baru
                              </label>
                              <input
                                type="password"
                                name="newPasswordConfirmation"
                                id="newPasswordConfirmation"
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2"
                                value={newPasswordConfirmation}
                                onChange={(e) =>
                                  setNewPasswordConfirmation(e.target.value)
                                }
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                          <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Change Password
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
