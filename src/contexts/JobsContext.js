import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const JobsContext = createContext();

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
};

export const JobsProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const { user } = useAuth();

  const fetchJobs = async () => {
    try {
      const response = await fetch(`https://api.github.com/repos/${process.env.REACT_APP_REPO_OWNER}/${process.env.REACT_APP_REPO_NAME}/contents/${process.env.REACT_APP_JOBS_FILE_PATH}`);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      const content = JSON.parse(atob(data.content));
      setJobs(content.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    }
  };

  const addJob = async (newJob) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    const jobToAdd = {
      ...newJob,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      createdBy: user.uid
    };

    try {
      const response = await fetch('https://api.github.com/repos/Shreyas-M-246418/spa-gh/dispatches', {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `Bearer ${process.env.REACT_APP_REPO_TOKEN}`
        },
        body: JSON.stringify({
          event_type: 'add-job',
          client_payload: {
            job: jobToAdd
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to trigger job creation');
      }

      setJobs(prev => [...prev, jobToAdd]);
      return { success: true, job: jobToAdd };
    } catch (error) {
      console.error('Error adding job:', error);
      return { success: false, error: error.message };
    }
  };

  const getUserJobs = () => {
    if (!user || !jobs) return [];
    return (jobs || []).filter(job => job?.createdBy === user.uid);
  };

  const value = {
    jobs,
    addJob,
    getUserJobs,
    fetchJobs
  };

  return (
    <JobsContext.Provider value={value}>
      {children}
    </JobsContext.Provider>
  );
};