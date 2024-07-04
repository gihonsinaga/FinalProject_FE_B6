import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useSelector } from "react-redux";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PlaneOrderHistogram = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://expressjs-production-53af.up.railway.app/api/v1/admin/all/order",
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();

      if (result.status && result.data) {
        const planeOrders = {};

        result.data.forEach((order) => {
          const planeName = order.detailFlight.detailPlaneId.plane.name;
          planeOrders[planeName] = (planeOrders[planeName] || 0) + 1;
        });

        const labels = Object.keys(planeOrders);
        const data = Object.values(planeOrders);

        // Array of colorful background colors
        const backgroundColors = [
          "rgba(255, 99, 132, 0.6)", // Red
          "rgba(54, 162, 235, 0.6)", // Blue
          "rgba(255, 206, 86, 0.6)", // Yellow
          "rgba(75, 192, 192, 0.6)", // Green
          "rgba(153, 102, 255, 0.6)", // Purple
          "rgba(255, 159, 64, 0.6)", // Orange
          "rgba(199, 199, 199, 0.6)", // Gray
          "rgba(83, 102, 255, 0.6)", // Indigo
          "rgba(255, 99, 255, 0.6)", // Pink
          "rgba(159, 159, 64, 0.6)", // Olive
        ];

        setChartData({
          labels,
          datasets: [
            {
              label: "Jumlah Pemesanan",
              data,
              backgroundColor: backgroundColors.slice(0, labels.length), // Use only as many colors as there are labels
            },
          ],
        });
      }
    } catch (error) {
      // console.error('Error fetching data:', error);
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Histogram Pemesanan Berdasarkan Jenis Pesawat",
      },
    },
  };

  return <Bar options={options} data={chartData} />;
};

export default PlaneOrderHistogram;
