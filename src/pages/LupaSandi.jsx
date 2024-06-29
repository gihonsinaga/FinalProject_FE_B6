// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// import "../index.css";
// import loginPict from "../assets/login.png";
// import ikon from "../assets/iFon.svg";

// export default function LupaSandi() {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');

//   const handleEmailChange = (event) => {
//     setEmail(event.target.value);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const response = await fetch('https://express-development-3576.up.railway.app/api/v1/users/forget-password', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email: email })
//       });
//       const data = await response.json();

//       // console.log(data);
//       // console.log(response.status);

//       if (response.ok) {
//         setMessage('Reset password link has been sent to your email.');
//         setTimeout(() => {
//           window.location.href = "https://mail.google.com/";
//         }, 2000); // Navigate to update password page
//       } else {
//         setMessage(data.message || 'An error occurred.');
//       }
//     } catch (error) {
//       console.log(error);
//       setMessage('Failed to connect to the server.');
//     }
//   };

//   return (
//     <div className="w-full">
//       <div className="flex flex-row-reverse">
//         <div className="max-sm:hidden flex flex-1 justify-end w-full h-screen">
//           <img className="sm:w-full rounded-l-[70px]" src={loginPict} alt="Login" />
//         </div>
//         <div className="pt-24 md:pt-0 flex flex-1 justify-center items-center">
//           <div className="flex flex-col gap-6">
//             <div className="flex flex-row pb-3">
//               <img className="w-12 h-12" src={ikon} alt="Login" />
//               <h1 className="flex items-center pl-3 font-bold text-3xl bg-gradient-to-r from-[#2193FA] to-[#C1DEE2] text-transparent bg-clip-text">FlyNow</h1>
//             </div>
//             <p className="text-[28px] font-bold pt-10">Reset Password</p>
//             <form className="flex flex-col gap-4 pb-6" onSubmit={handleSubmit}>
//               <div className="flex flex-col gap-4 w-full">
//                 <label>Input Email</label>
//                 <input className="bg-gray-200 h-[48px] border-[3px] md:w-[450px] w-full border-gray-200 p-3 rounded-lg text-gray-800 focus:outline-none focus:bg-white focus:border-[#2193FA]" type="email" value={email} onChange={handleEmailChange} required />
//               </div>
//               <button className="shadow-lg w-full h-[48px] self-center mt-4 bg-[#2193FA] hover:bg-[#2154fa] focus:shadow-outline focus:outline-none text-white font-bold py-3 px-5 rounded-lg" type="submit">Reset Password</button>
//             </form>
//             {message && <p>{message}</p>}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { toast, Toaster } from "react-hot-toast"; // Import react-hot-toast
import "../index.css";
import loginPict from "../assets/login.png";
import ikon from "/assets/LogoFlyNow.svg";

export default function LupaSandi() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        "https://express-development-3576.up.railway.app/api/v1/users/forget-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        toast.success("Succes Sent.");
        setMessage("Reset password link has been sent to your email.");
        setTimeout(() => {
          window.location.href = "https://mail.google.com/";
        }, 2000); // Navigate to update password page
      } else {
        toast.error(data.message || "An error occurred.");
        setMessage(data.message || "An error occurred.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to connect to the server.");
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-row-reverse">
        <div className="max-sm:hidden flex flex-1 justify-end w-full h-screen">
          <img
            className="sm:w-full rounded-l-[70px]"
            src={loginPict}
            alt="Login"
          />
        </div>
        <div className="pt-24 md:pt-0 flex flex-1 justify-center items-center max-sm:text-xs">
          <div className="flex flex-col gap-6">
            <div className="flex flex-row pb-3">
              <img className="w-12 h-12" src={ikon} alt="Login" />
              <h1 className="flex items-center pl-3 font-bold text-3xl bg-gradient-to-r from-[#535F6B] to-[#C1DEE2] text-transparent bg-clip-text">
                FlyNow
              </h1>
            </div>
            <p className="text-[28px] font-bold pt-10 ">Reset Password</p>
            <form className="flex flex-col gap-4 pb-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4 w-full">
                <label>Input Email</label>
                <input
                  className="bg-gray-200 h-[48px] border-[3px] md:w-[450px] w-full border-gray-200 p-3 rounded-lg text-gray-800 focus:outline-none focus:bg-white focus:border-[#2193FA]"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </div>
              <button
                className="shadow-lg w-full h-[48px] self-center mt-4 bg-slate-500 hover:bg-slate-600 focus:shadow-outline focus:outline-none text-white font-bold py-3 px-5 rounded-lg "
                type="submit"
              >
                Reset Password
              </button>
            </form>
            {message && <p>{message}</p>}
          </div>
        </div>
      </div>
      <div className="text-xs">
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
    </div>
  );
}
