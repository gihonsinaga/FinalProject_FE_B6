import React, { useEffect, useState } from "react";
import Nav from "../component/Nav";
import BottomNav from "../component/BottomNav";
import Footer from "../component/Footer";
import axios from "axios";

export default function Plane() {
  const [planes, setPlanes] = useState([]);
  const [detailPlane, setDetailPlane] = useState(null);
  const [visiblePlanes, setVisiblePlanes] = useState(9);
  const [loading, setLoading] = useState(false);
  console.log("end");

  useEffect(() => {
    const getPlanes = async () => {
      try {
        const response = await axios.get(
          "https://express-development-3576.up.railway.app/api/v1/planes"
        );
        if (response.status === 200) {
          setPlanes(response.data.data);
        } else {
          console.error("Error fetching planes:", response);
        }
      } catch (error) {
        console.error("Error fetching planes:", error);
      }
    };

    getPlanes();
  }, []);

  const handleCardClick = async (id) => {
    if (detailPlane && detailPlane.id === id) {
      setDetailPlane(null);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://express-development-3576.up.railway.app/api/v1/plane/${id}`
      );
      if (response.status === 200) {
        setDetailPlane(response.data.data);
      } else {
        console.error("Error fetching plane details:", response);
      }
    } catch (error) {
      console.error("Error fetching plane details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeeMore = () => {
    setVisiblePlanes((prevVisible) => prevVisible + 9);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className=" max-sm:h-[60px] ">
        <Nav isHomePage={false} />
        {/* <div className="container flex flex-col justify-center p-6 sm:py-12 sm:px-40 lg:py-20 lg:flex-row lg:justify-between"></div> */}
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="sm:text-3xl font-bold mb-6 text-center tracking-wide sm:mt-20">
          Daftar Pesawat
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:mx-20">
          {planes.slice(0, visiblePlanes).map((plane) => (
            <div
              key={plane.id}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg "
              onClick={() => handleCardClick(plane.id)}
            >
              <div className="p-6">
                <h2 className="text-lg font-bold mb-2 max-sm:text-xs">
                  {plane.name}
                </h2>
                <p className="text-gray-600 text-sm max-sm:text-[10px]">
                  Seri ( {plane.series} )
                </p>
                <p className="text-gray-600 text-sm max-sm:text-[10px]">
                  Kapasitas - {plane.capacity} penumpang
                </p>
              </div>
              {detailPlane && detailPlane.id === plane.id && (
                <div className="bg-gray-50 p-4 border-t">
                  {loading ? (
                    <p className="text-sm text-gray-500">Loading...</p>
                  ) : (
                    <>
                      {detailPlane?.DetailPlane?.map((e, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mx-2 mb-1 text-gray-400 max-sm:text-[10px]">
                            <div className="">{e?.seat_class?.type_class}</div>
                            <div> {e?.total_seat} orang</div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        {visiblePlanes < planes.length && (
          <div className="mt-8 text-center">
            <button
              onClick={handleSeeMore}
              className="bg-gray-500 hover:bg-white hover:text-gray-500 hover:border-gray-500 border text-white font-medium py-2 px-4 rounded-full text-sm max-sm:text-xs"
            >
              See More
            </button>
          </div>
        )}
      </div>

      <div className="max-sm:mt-10 max-sm:mb-7">
        {/* <div className="max-sm:hidden">
          <Footer />
        </div> */}
        <div className="sm:hidden ">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
