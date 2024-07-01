import React, { useState, useEffect } from "react";
import Nav from "../component/Nav";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/reducers/authReducers";
import BottomNav from "../component/BottomNav";
import { toast, Toaster } from "react-hot-toast";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [formData, setFormData] = useState({
    avatar_url: user?.data?.avatar_url || "",
    fullname: user?.data?.fullname || "",
    phoneNumber: user?.data?.phoneNumber || "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(user?.data?.avatar_url || "");

  useEffect(() => {
    if (token == null) {
      toast.error("Please login first");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  }, []);

  // useEffect(() => {
  //   const storedImage = localStorage.getItem("avatar_url");
  //   if (storedImage) {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       avatar_url: storedImage,
  //     }));
  //     setPreview(storedImage);
  //   }
  // }, []);

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

      // console.log("Profile updated successfully:", data);
      dispatch(setUser(data));

      localStorage.setItem("avatar_url", data.data.avatar_url);

      setFormData((prevData) => ({
        ...prevData,
        avatar_url: data.data.avatar_url,
      }));

      setPreview(data.data.avatar_url);

      setIsEditing(false);

      // Show success toast
      toast.success("sukses merubah profil");
    } catch (error) {
      // console.error("Error updating profile:", error);

      // Show error toast
      toast.error("gagal merubah profil");
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className=" max-sm:h-[60px] ">
        <Nav isHomePage={false} />
        {/* <div className="container flex flex-col justify-center p-6 sm:py-12 sm:px-40 lg:py-20 lg:flex-row lg:justify-between"></div> */}
      </div>
      <div className="mb-4 flex justify-between   sm:hidden">
        <button
          className="w-full text-left font-bold bg-slate-500 text-white sm:rounded-2xl px-4 py-3 sm:py-3 lg:py-4 max-sm:text-sm"
          onClick={() => navigate("/")}
        >
          ← <span className="max-sm:ml-3"> Beranda </span>
        </button>
      </div>{" "}
      <div className="container mx-auto sm:px-20 lg:px-36 py-16 sm:py-24 lg:py-32 max-sm:text-xs max-sm:pt-5 max-sm:pb-20">
        <header>
          <div className="mx-auto px-4">
            <div className="mb-4 flex justify-between py-2 max-sm:hidden">
              <button
                className="w-full text-left font-semibold bg-slate-500 text-white  px-4 py-2 sm:py-3 lg:py-4 max-sm:text-base"
                onClick={() => navigate("/")}
              >
                ← <span className="max-sm:ml-3 ml-5"> Beranda </span>
              </button>
            </div>
          </div>
        </header>
        <main>
          <div className="mx-auto px-4">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6 bg-white border-b border-gray-200">
                <div className="mt-10 sm:mt-0">
                  <div className="md:grid md:grid-cols-3 md:gap-6">
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
                              src={preview}
                              // alt="Profile"
                              className="h-full w-full object-cover"
                              onClick={() =>
                                document.getElementById("avatarUpload").click()
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
                      <div className="pt-12 sm:pt-20 pb-6 px-4 text-center max-sm:text-xs">
                        <h2 className="max-sm:text-base sm:text-xl font-bold text-black mb-1">
                          {user?.data?.fullname}
                        </h2>
                        <p className="sm:text-sm text-gray-600">
                          {user?.data?.email}
                        </p>
                        <p className="sm:text-sm text-gray-600">
                          {user?.data?.phoneNumber}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <div>
                        <div className=" overflow-hidden sm:rounded-md">
                          <div className="px-4 py-5 bg-white sm:p-6 ">
                            <div className="flex justify-between mb-10">
                              <h3 className="sm:text-lg font-medium leading-6 text-gray-900 max-sm:text-base">
                                Data Profil
                              </h3>
                              {!isEditing ? (
                                <button
                                  className="inline-flex px-4 justify-center border border-transparent shadow-sm text-md font-medium rounded-md text-slate-600 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                                  className="mt-1 cursor-pointer border-b focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2"
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
                                  className="mt-1 cursor-pointer border-b focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2"
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
                                  className="mt-1 cursor-pointer border-b focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2"
                                  value={user?.data?.email}
                                  readOnly
                                />
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
          </div>
        </main>
      </div>
      <div className="sm:hidden">
        <BottomNav />
      </div>
      <Toaster />
    </div>
  );
}
