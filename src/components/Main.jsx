import React, { useState, useEffect } from 'react';
import axios, {isCancel, AxiosError} from 'axios';
import { Bar, Line,Pie } from 'react-chartjs-2';

const Main = () => {
  const [countries, setCountries] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [sdate, setSDate] = useState('');
  const [edate, setEDate] = useState('');
  const [chartData, setChartData] = useState({});
  const [chartType, setChartType] = useState('bar');
  const [viewName, setViewName] = useState('');

  useEffect(() => {
    fetchCountries();
    fetchIndicators();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await axios.get('https://api.worldbank.org/v2/country?format=json');
      console.log(response.data); 
      const countryData = response.data[1].map((country) => ({
        id: country.id,
        name: country.name,
      }));
      setCountries(countryData);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchIndicators = async () => {
    try {
      const response = await axios.get('https://api.worldbank.org/v2/indicator?format=json');
      console.log(response.data); 
      const indicatorData = response.data[1].map((indicator) => ({
        id: indicator.id,
        name: indicator.name,
      }));
      setIndicators(indicatorData);
    } catch (error) {
      console.error('Error fetching indicators:', error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        
        `https://api.worldbank.org/v2/country/${selectedCountry}/indicator/${selectedIndicator}?date=${sdate}:${edate}&format=json`
      );
      console.log(response.data); 
      const data = response.data[1];
      if (data) {
        const chartLabels = data.map((entry) => entry.date);
        const chartValues = data.map((entry) => entry.value);
          
        setChartData({
          labels: chartLabels,
          datasets: [
            {
              label: selectedIndicator,
              data: chartValues,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
          ],
        });
      }
      else{
        console.log('Data is undefined');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const saveView = async () => {
    try {
      const viewData = {
        name: viewName,
        country: selectedCountry,
        indicator: selectedIndicator,
        chartType: chartType,
      };
      await axios.post('your-backend-api-url', viewData);
      console.log('View saved successfully');
    } catch (error) {
      console.error('Error saving view:', error);
    }
  };

  return (
    <div>
      <h1>World Bank Data Visualization</h1>
      <div>
        <label htmlFor="country">Select Country:</label>
        <input
          type="text"
          id="country"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="indicator">Select Indicator:</label>
        <input
          type="text"
          id="indicator"
          value={selectedIndicator}
          onChange={(e) => setSelectedIndicator(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="date">Start date:</label>
        <input
          type="date"
          id="sdate"
          value={sdate}
          onChange={(e) => setSDate(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="date">Start date:</label>
        <input
          type="date"
          id="edate"
          value={edate}
          onChange={(e) => setEDate(e.target.value)}
        />
      </div>
      <div>
        <button onClick={fetchData}>Fetch Data</button>
      </div>
      <div>
        <label htmlFor="chartType">Chart Type:</label>
        <select
          id="chartType"
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
        >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="pie">Pie</option>
        </select>
      </div>
      <div>
        {/* {chartData && (
          <div>
            {chartType === 'bar' && <Bar data={chartData} />}
            {chartType === 'line' && <Line data={chartData} />}
            {chartType === 'pie' && <Pie data={chartData} />}
          </div>
        )} */}
      </div>
      <div>
        <label htmlFor="viewName">View Name:</label>
        <input
          type="text"
          id="viewName"
          value={viewName}
          onChange={(e) => setViewName(e.target.value)}
        />
        <button onClick={saveView}>Save View</button>
      </div>
    </div>
  );
};

export default Main;