import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AttendanceChartProps {
  attendanceData: {
    present: number;
    absent: number;
    late: number;
  };
  type: 'bar' | 'pie';
}

export const AttendanceChart: React.FC<AttendanceChartProps> = ({ attendanceData, type }) => {
  const data = {
    labels: ['Registrados', 'Inasistencias'],
    datasets: [
      {
        label: 'Asistencias',
        data: [attendanceData.present, attendanceData.absent],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',  // Verde para registrados
          'rgba(239, 68, 68, 0.8)',  // Rojo para inasistencias
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Distribución de Asistencias',
      },
    },
  };

  return type === 'bar' ? (
    <Bar data={data} options={options} />
  ) : (
    <Pie data={data} options={options} />
  );
}; 