import React from "react";
import Nav from "../component/Nav";
import loginPict from "../assets/login.png";
import Footer from "../component/Footer";

export default function AboutUS() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Nav />
      <div className="container mx-auto px-4 sm:px-12 lg:px-40 py-24">
        <h1 className="text-2xl font-semibold mb-6">Tentang Kami</h1>
        <section className="bg-white border rounded-xl shadow-lg mb-14 flex flex-col lg:flex-row">
          <div className="px-8 sm:px-16 lg:px-20 py-12 lg:py-44 flex-1">
            <h2 className="text-3xl font-semibold text-blue-800 mb-2">
              Misi Kami
            </h2>
            <p className="text-gray-700 text-sm max-w-sm">
              Kami berkomitmen untuk memberikan layanan pemesanan tiket pesawat
              yang cepat, aman, dan mudah digunakan. Kami terus berinovasi untuk
              mengembangkan solusi yang mendukung perjalanan yang lebih ramah
              lingkungan dan berkelanjutan. Kami berupaya berkontribusi positif
              kepada masyarakat dengan mendukung inisiatif sosial dan
              lingkungan. Kami menjunjung tinggi transparansi dan integritas
              dalam setiap aspek bisnis kami, serta selalu mendengarkan dan
              memahami kebutuhan pelanggan untuk memberikan pengalaman terbaik
              dalam setiap pemesanan tiket pesawat.
            </p>
          </div>
          <div className="hidden lg:block flex-shrink-0">
            <img
              src={loginPict}
              className="w-full h-full object-cover rounded-b-xl lg:rounded-b-none lg:rounded-r-xl"
              alt=""
            />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Nilai Kami</h2>
          <div className="grid grid-cols-3 gap-5 max-sm:grid-cols-1 max-md:grid-cols-2 max-sm:text-sm ">
            <div className="border-2 rounded-3xl sm:px-10 sm:py-7 max-sm:px-3 max-sm:py-4  border-slate-400 max-sm:text-center">
              <div>
                <img
                  src="/assets/WhyUs1.png"
                  width="60px"
                  height="65px"
                  alt=""
                  className="max-sm:w-[40px] max-sm:mx-auto"
                />
              </div>
              <div className="font-bold sm:mt-7 max-sm:mt-2 mb-1 sm:text-base text-black tracking-wide max-sm:text-sm">
                Terjangkau
              </div>
              <div className="sm:text-sm text-black max-sm:text-xs">
                Kami menyediakan berbagai macam harga, termasuk yang paling
                murah
              </div>
            </div>

            <div className="border-2 rounded-3xl sm:px-10 sm:py-7 max-sm:px-3 max-sm:py-4 border-slate-400 max-sm:text-center">
              <div>
                <img
                  src="/assets/WhyUs2.png"
                  width="60px"
                  height="65px"
                  alt=""
                  className="max-sm:w-[40px] max-sm:mx-auto"
                />
              </div>
              <div className="font-bold sm:mt-7 max-sm:mt-2 mb-1 sm:text-base text-black tracking-wide max-sm:text-sm">
                Efisien
              </div>
              <div className="sm:text-sm text-black max-sm:text-xs">
                Kami dapat mengantarkan kebutuhan Anda lebih cepat{" "}
              </div>
            </div>

            <div className="border-2 rounded-3xl sm:px-10 sm:py-7 max-sm:px-3 max-sm:py-4 border-slate-400 max-sm:text-center">
              <div>
                <img
                  src="/assets/WhyUs3.png"
                  width="60px"
                  height="65px"
                  alt=""
                  className="max-sm:w-[40px] max-sm:mx-auto"
                />
              </div>
              <div className="font-bold sm:mt-7 max-sm:mt-2 mb-1 sm:text-base text-black tracking-wide max-sm:text-sm">
                Kesetiaan pelanggan
              </div>
              <div className="sm:text-sm text-black max-sm:text-xs">
                Selalu memberikan layanan #1 untuk pelanggan{" "}
              </div>
            </div>
          </div>
        </section>

        <section>
          {/* <h2 className="text-2xl font-semibold mb-2">Tim Kami</h2> */}
          <div className="bg-white rounded-xl sm:p-20 md:px-16 lg:px-32 lg:py-16 my-12">
            <div className="mb-12 font-bold text text-2xl">
              FlyNow Team
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105">
                  <img
                    src="assets/gihon.jpg"
                    alt="Anggota Tim 1"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-secondaryBlue mb-1">
                      Gihon Sinaga
                    </h3>
                    <p className="text-sm text-gray-600">Front End Developer</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105">
                  <img
                    src="assets/zanneta.png"
                    alt="Anggota Tim 2"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-secondaryBlue mb-1">
                      Zanetta Aisha D
                    </h3>
                    <p className="text-sm text-gray-600">Front End Developer</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105">
                  <img
                    src="assets/rafi.jpg"
                    alt="Anggota Tim 3"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-secondaryBlue mb-1">
                      Rafi Dhafin E
                    </h3>
                    <p className="text-sm text-gray-600">Front End Developer</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105">
                  <img
                    src="assets/bagus.png"
                    alt="Anggota Tim 1"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-secondaryBlue mb-1">
                      Bagus Dwi Putra A
                    </h3>
                    <p className="text-sm text-gray-600">Back End Developer</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105">
                  <img
                    src={loginPict}
                    alt="Anggota Tim 2"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-secondaryBlue mb-1">
                      Akhdan Robbani
                    </h3>
                    <p className="text-sm text-gray-600">Back End Developer</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105">
                  <img
                    src="assets/shakti.JPG"
                    alt="Anggota Tim 3"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-secondaryBlue mb-2">
                      Lanang Shakti P
                    </h3>
                    <p className="text-sm text-gray-600">Back End Developer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
