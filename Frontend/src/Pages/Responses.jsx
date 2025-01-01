import React, { useState,useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useParams } from "react-router-dom";
import { CiCalendar } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from '../Styles/Responses.module.css';
import { X } from 'lucide-react';
import { useTheme } from "../Contexts/ThemeContext";
import axios from 'axios';


ChartJS.register(ArcElement, Tooltip, Legend);

const Responses = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { formId, name } = useParams();
  const [views, setViews] = useState(0);
  const [starts, setStarts] = useState(0);
  const navigate = useNavigate();

  const handleflow = () => {
    navigate(`/forms/${formId}/${name}`);
  };

  const handleclosebtn = () => {
    navigate(`/dashboard`);
  };
  

  const getViews = async () => {
    try { 
      const response = await axios.get(`https://final-evaluation-qbj9.onrender.com/api/v1/responses/get-views/${formId}`);
      if(response.status === 200) {
        setViews(response.data.views);
      }
      
    } catch (error) {
      console.error('Error fetching views:', error);
    }
  };

  const getStarts = async () => {
    try {
      const response = await axios.get(`https://final-evaluation-qbj9.onrender.com/api/v1/responses/get-starts/${formId}`);
      if(response.status === 200) {
        setStarts(response.data.starts);
      }
    } catch (error) {
      console.error('Error fetching starts:', error);
    }
  };

  const chartData = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [33, 67],
        backgroundColor: ['#0066ff', '#404040'],
        borderWidth: 0,
      },
    ],
  };

  const mockData = [
    { 
      id: 1, 
      submittedAt: 'Jul 17, 03:23 PM', 
      button1: 'Hi!', 
      email1: 'abc@g.com',
      text1: 'alpha',
      button2: 'Studio App to Manage Clients, Tracking App for Clients',
      rating1: 5,
      marks : 20,
      totalMarks : 25
    },
    // other mock data...
  ];

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}%`,
        },
      },
    },
    cutout: '70%', // For a more circular appearance
  };

  useEffect(() => {
    getViews();
    getStarts();
  }, []);

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.dark : styles.light}`}>
      <div className={`${styles.header} ${isDarkMode ? styles.dark : styles.light}`}>
        <div className={`${styles.headerControls} ${isDarkMode ? styles.dark : styles.light}`}>
          <div className={`${styles.navigationButtons} ${isDarkMode ? styles.dark : styles.light}`}>
            <button className={`${styles.navButton} ${styles.navButtonActive} ${isDarkMode ? styles.dark : styles.light}`} onClick={handleflow}>Flow</button>
            <button className={`${styles.navButton_res} ${isDarkMode ? styles.dark : styles.light}` }>Response</button>
          </div>
          <div className={`${styles.headerActions} ${isDarkMode ? styles.dark : styles.light}`}>
            <div className={`${styles.toggleContainer} ${isDarkMode ? styles.dark : styles.light}`}>
              <span className={`${styles.theme_label} ${isDarkMode ? styles.textDark : styles.textLight}`}>
                <p className={`${styles.light_mode} ${isDarkMode ? styles.dark : styles.light}`}>Light</p>
                <label className={styles.switch}>
                  <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
                  <span className={`${styles.slider} ${styles.round}`}></span>
                </label>
                <p className={`${styles.Dark_mode} ${isDarkMode ? styles.dark : styles.light}`}>Dark</p>
              </span>
            </div>
            <button className={`${styles.shareButton} ${isDarkMode ? styles.dark : styles.light}` } >Share</button>
            <button className={`${styles.saveButton} ${isDarkMode ? styles.dark : styles.light}`} >Save</button>
            <button className={styles.closeButton}>
              <X size={24} onClick={handleclosebtn} />
            </button>
          </div>
        </div>
      </div>

      {/* Check if views is greater than 1 */}
      {views > 1 ? (
        <div className={styles.statsContainer}>
          <div className={`${styles.statCard} ${isDarkMode ? styles.dark : styles.light}`}>
            <div className={`${styles.statLabel} ${isDarkMode ? styles.dark : styles.light}`}>Views</div>
            <div className={`${styles.statValue} ${isDarkMode ? styles.dark : styles.light}`}>{views}</div>
          </div>
          <div className={`${styles.statCard} ${isDarkMode ? styles.dark : styles.light}`}>
            <div className={`${styles.statLabel} ${isDarkMode ? styles.dark : styles.light}`}>Starts</div>
            <div className={`${styles.statLabel} ${isDarkMode ? styles.dark : styles.light}`}>{starts}</div>
          </div>
        </div>
      ) : (
        <div className={`${styles.noResponseContainer} ${isDarkMode ? styles.dark : styles.light}`}>
          <p className={`${styles.noResponseText} ${isDarkMode ? styles.dark : styles.light}`}>No Response yet collected</p>
        </div>
      )}

      {/* Table and Metrics (if views > 1) */}
      {views > 1 && (
        <>
          <div className={styles.tableContainer}>
            <div className={styles.tableWrapper}>
              <table className={`${styles.table} ${isDarkMode ? styles.dark : styles.light}`}>
                <thead>
                  <tr>
                    <th className={`${styles.th} ${isDarkMode ? styles.dark : styles.light}`} style={{ width: '20px' }}></th>
                    <th className={`${styles.th} ${isDarkMode ? styles.dark : styles.light}`}> <p className={styles.submited}><CiCalendar className={styles.cal} /> Submitted at</p></th>
                    <th className={`${styles.th} ${isDarkMode ? styles.dark : styles.light}`}>Button 1</th>
                    <th className={`${styles.th} ${isDarkMode ? styles.dark : styles.light}`}>Email 1</th>
                    <th className={`${styles.th} ${isDarkMode ? styles.dark : styles.light}`}>Text 1</th>
                    <th className={`${styles.th} ${isDarkMode ? styles.dark : styles.light}`}>Button 2</th>
                    <th className={`${styles.th} ${isDarkMode ? styles.dark : styles.light}`}>Rating 1</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.map((row) => (
                    <tr key={row.id}>
                      <td className={`${styles.td} ${isDarkMode ? styles.dark : styles.light}`} style={{ width: '20px' }}>{row.id}</td>
                      <td className={`${styles.td} ${isDarkMode ? styles.dark : styles.light}`}>{row.submittedAt}</td>
                      <td className={`${styles.td} ${isDarkMode ? styles.dark : styles.light}`}>{row.button1}</td>
                      <td className={`${styles.td} ${isDarkMode ? styles.dark : styles.light}`}>{row.email1}</td>
                      <td className={`${styles.td} ${isDarkMode ? styles.dark : styles.light}`}>{row.text1}</td>
                      <td className={`${styles.td} ${isDarkMode ? styles.dark : styles.light}`}>{row.button2}</td>
                      <td className={`${styles.td} ${isDarkMode ? styles.dark : styles.light}`} style={{textAlign : 'center'}}>{row.rating1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.metricsContainer}>
            <div className={styles.metricCard}>
              <div className={styles.progressCircle}>
                <Doughnut data={chartData} options={chartOptions} />
              </div>
              <div className={styles.progressStats}>
                <div className={`${styles.statValue} ${isDarkMode ? styles.dark : styles.light}`}>Completed</div>
                <div className={styles.statValue}>33</div>
              </div>
            </div>

            <div className={`${styles.completionRateCard} ${isDarkMode ? styles.dark : styles.light}`}>
              <div>
                <div className={`${styles.statValue} ${isDarkMode ? styles.dark : styles.light}`}>Completion rate</div>
                <div className={styles.statValue}>33%</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Responses;
