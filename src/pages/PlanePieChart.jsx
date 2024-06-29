import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PlanePieChart = ({ planes }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (planes && planes.length > 0) {
      const planeTypes = planes.map(plane => plane.name);
      const uniquePlaneTypes = Array.from(new Set(planeTypes));
      const planeTypeCounts = uniquePlaneTypes.map(type => 
        planeTypes.filter(name => name === type).length
      );

      setChartData({
        labels: uniquePlaneTypes,
        datasets: [{
          data: planeTypeCounts,
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#25CCFF', '#FFA8B6', '#A8B6FF', '#FFD1DC',
          ],
          hoverBackgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#25CCFF', '#FFA8B6', '#A8B6FF', '#FFD1DC',
          ],
        }],
      });
    }
  }, [planes]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Distribusi Jenis Pesawat',
      },
    },
    cutout: '50%', // This determines the size of the hole in the middle
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 2000, // Animation duration in milliseconds
      easing: 'easeInOutQuart', // Easing function
    },
    hover: {
      animationDuration: 500, // Duration of hover animation
    },
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {chartData.labels.length > 0 ? (
        <Pie data={chartData} options={options} />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default PlanePieChart;