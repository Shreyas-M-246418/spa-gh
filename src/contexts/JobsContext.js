import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import githubApi from '../utils/githubApi';

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
      const jobsList = await githubApi.getJobs();
      setJobs(jobsList);
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
      const result = await githubApi.createJob(jobToAdd);
      if (result.success) {
        setJobs(prev => [...prev, jobToAdd]);
      }
      return result;
    } catch (error) {
      console.error('Error adding job:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    jobs,
    addJob,
    fetchJobs
  };

  return (
    <JobsContext.Provider value={value}>
      {children}
    </JobsContext.Provider>
  );
};