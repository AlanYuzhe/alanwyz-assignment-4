import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './App.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query) return;
  
    try {
      const response = await axios.post('http://localhost:5000/search', { query }, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log("Response Data:", response.data);
  
      if (Array.isArray(response.data)) {
        setResults(response.data);
      } else {
        console.error('Unexpected response structure:', response.data);
        setResults([]); 
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setResults([]);
    }
  };

  const chartData = results.length > 0 ? {
    labels: results.map((result) => `Document ${result.doc_index}`),
    datasets: [
      {
        label: 'Cosine Similarity',
        data: results.map((result) => result.similarity),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  } : null;

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="container">
      <h1>Latent Semantic Analysis (LSA) Search Engine</h1>
      <input
        type="text"
        placeholder="Enter search query..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {results.length > 0 && (
        <div className="results">
          <h2>Results</h2>

          {results.map((result, index) => (
            <div key={index} className="result-item">
              <h3>Document {result.doc_index}</h3>
              <p>{result.document}</p>
              <p className="similarity">Similarity: {result.similarity.toFixed(4)}</p>
            </div>
          ))}

            <div className="chart-container">
              <Bar data={chartData} options={chartOptions} />
            </div>
          
        </div>
      )}
    </div>
  );
}

export default App;