import React, { useState, useEffect } from 'react';
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
  const [submissions, setSubmissions] = useState([]);
  const [completed, setCompleted] = useState(0);
  const [complitionRate, setComplitionRate] = useState(0);
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

  const getsubmissions = async () => {
    try {
      const response = await axios.get(`https://final-evaluation-qbj9.onrender.com/api/v1/responses/get-submissions/${formId}`);
      if(response.status === 200) {
        setSubmissions(response.data.submissions);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  
  const getLabels = () => {
    if (submissions.length === 0) return [];
    return submissions[0].responses.map(response => response.label)
    .filter(label => label !== 'User Email' && label !== 'User Name');
  };

 
  const getResponseData = (submission, label) => {
    const response = submission.responses.find(r => r.label === label);
    return response ? response.data : '-';
  };

  const chartData = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [completed, starts - completed],
        backgroundColor: ['#0066ff', '#404040'],
        borderWidth: 0,
      },
    ],
  };

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
    cutout: '70%',
  };

  const calculateMetrics = () => {
    if (!submissions.length || !starts) {
      setCompleted(0);
      setComplitionRate(0);
      return;
    }

    
    const completedCount = submissions.filter(submission =>
      submission.responses.every(response => response.data !== '-')
    ).length;

    setCompleted(completedCount);

   
    const rate = ((completedCount / starts) * 100).toFixed(0);
    setComplitionRate(rate);
  };

  useEffect(() => {
    calculateMetrics();
  }, [submissions, starts]);


  useEffect(() => {
    getViews();
    getStarts();
    getsubmissions();
  }, []);

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.dark : styles.light}`}>
      <div className={`${styles.header} ${isDarkMode ? styles.dark : styles.light}`}>
        <div className={`${styles.headerControls} ${isDarkMode ? styles.dark : styles.light}`}>
          <div className={`${styles.navigationButtons} ${isDarkMode ? styles.dark : styles.light}`}>
            <button className={`${styles.navButton} ${styles.navButtonActive} ${isDarkMode ? styles.dark : styles.light}`} onClick={handleflow}>Flow</button>
            <button className={`${styles.navButton_res} ${isDarkMode ? styles.dark : styles.light}`}>Response</button>
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
            <button className={`${styles.shareButton} ${isDarkMode ? styles.dark : styles.light}`}>Share</button>
            <button className={`${styles.saveButton} ${isDarkMode ? styles.dark : styles.light}`}>Save</button>
            <button className={styles.closeButton}>
              <X size={24} onClick={handleclosebtn} />
            </button>
          </div>
        </div>
      </div>

      {views >= 1 ? (
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

      {submissions.length > 0 && (
        <>
          <div className={styles.tableContainer}>
            <div className={styles.tableWrapper}>
              <table className={`${styles.table} ${isDarkMode ? styles.dark : styles.light}`}>
                <thead>
                  <tr>
                    <th className={`${styles.th} ${isDarkMode ? styles.dark : styles.light}`} style={{ width: '20px' }}></th>
                    <th className={`${styles.th} ${isDarkMode ? styles.dark : styles.light}`}>
                      <p className={styles.submited}><CiCalendar className={styles.cal} /> Submitted at</p>
                    </th>
                    {getLabels().map((label, index) => (
                      <th key={index} className={`${styles.th} ${isDarkMode ? styles.dark : styles.light}`}>
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission, index) => (
                    <tr key={submission._id}>
                      <td className={`${styles.td} ${isDarkMode ? styles.dark : styles.light}`} style={{ width: '20px' }}>{index + 1}</td>
                      <td className={`${styles.td} ${isDarkMode ? styles.dark : styles.light}`}>
                        {new Date(submission.submittedAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </td>
                      {getLabels().map((label, labelIndex) => (
                        <td key={labelIndex} className={`${styles.td} ${isDarkMode ? styles.dark : styles.light}`}>
                          {getResponseData(submission, label)}
                        </td>
                      ))}
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
                <div className={styles.statValue}>{completed}</div>
              </div>
            </div>

            <div className={`${styles.completionRateCard} ${isDarkMode ? styles.dark : styles.light}`}>
              <div>
                <div className={`${styles.statValue} ${isDarkMode ? styles.dark : styles.light}`}>Completion rate</div>
                <div className={styles.statValue}>{complitionRate}%</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Responses;