import React, { useEffect } from "react";
import Nav from "../component/Nav";
import loginPict from "../assets/login.png";
import Footer from "../component/Footer";

export default function AboutUS() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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

        <section className="mb-20">
          <h2 className="text-2xl font-semibold mb-6">Nilai Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white cursor-pointer border border-blue-700 rounded-lg shadow-lg p-8 lg:p-14 transform transition duration-500 hover:scale-105">
              <h3 className="text-xl font-bold text-blue-700 mb-3">
                Kemudahan
              </h3>
              <p className="text-gray-700 text-sm">
                Kami memastikan proses pemesanan tiket pesawat yang cepat,
                mudah, dan aman untuk memberikan kenyamanan terbaik bagi
                pelanggan kami.
              </p>
            </div>
            <div className="bg-white cursor-pointer border border-blue-700 rounded-lg shadow-lg p-8 lg:p-14 transform transition duration-500 hover:scale-105">
              <h3 className="text-xl font-bold text-blue-700 mb-3">Inovasi</h3>
              <p className="text-gray-700 text-sm">
                Kami terus berinovasi dalam mengembangkan solusi pemesanan yang
                cerdas dan ramah lingkungan untuk perjalanan yang lebih baik.
              </p>
            </div>
            <div className="bg-white cursor-pointer border border-blue-700 rounded-lg shadow-lg p-8 lg:p-14 transform transition duration-500 hover:scale-105">
              <h3 className="text-xl font-bold text-blue-700 mb-3">
                Pelayanan
              </h3>
              <p className="text-gray-700 text-sm">
                Kami berkomitmen untuk memberikan pelayanan terbaik dengan
                mendengarkan dan memahami kebutuhan setiap pelanggan kami.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Tim Kami</h2>
          <div className="bg-white rounded-xl p-6 sm:p-12 lg:px-24 lg:py-12 my-12">
            <div className="mb-12 font-bold text-center text-xl">
              Front End
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105">
                  <img
                    src={loginPict}
                    alt="Anggota Tim 1"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-secondaryBlue mb-2">
                      Nama Anggota 1
                    </h3>
                    <p className="text-xl text-gray-600">CEO</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105">
                  <img
                    src={loginPict}
                    alt="Anggota Tim 2"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-secondaryBlue mb-2">
                      Nama Anggota 2
                    </h3>
                    <p className="text-xl text-gray-600">CTO</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105">
                  <img
                    src={loginPict}
                    alt="Anggota Tim 3"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-secondaryBlue mb-2">
                      Nama Anggota 3
                    </h3>
                    <p className="text-xl text-gray-600">CFO</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-12 font-bold text-center text-xl">
              Back End
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105">
                  <img
                    src={loginPict}
                    alt="Anggota Tim 1"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-secondaryBlue mb-2">
                      Nama Anggota 1
                    </h3>
                    <p className="text-xl text-gray-600">CEO</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105">
                  <img
                    src={loginPict}
                    alt="Anggota Tim 2"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-secondaryBlue mb-2">
                      Nama Anggota 2
                    </h3>
                    <p className="text-xl text-gray-600">CTO</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105">
                  <img
                    src={loginPict}
                    alt="Anggota Tim 3"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-secondaryBlue mb-2">
                      Nama Anggota 3
                    </h3>
                    <p className="text-xl text-gray-600">CFO</p>
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
