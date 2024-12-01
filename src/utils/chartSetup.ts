import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

// Configure default options
ChartJS.defaults.font.family = 'Inter var, sans-serif';
ChartJS.defaults.color = '#6B7280';
ChartJS.defaults.borderColor = '#E5E7EB';

// Ensure scales are properly registered
ChartJS.register({
  id: 'linear',
  type: 'linear',
  min: 0,
  max: 100,
  ticks: {
    stepSize: 10,
  },
});