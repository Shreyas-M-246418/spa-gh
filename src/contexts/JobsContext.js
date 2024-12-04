import React, { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    // Load jobs from localStorage or use initial data
    const storedJobs = localStorage.getItem('jobs');
    if (storedJobs) {
      setJobs(JSON.parse(storedJobs));
    }
  }, []);

  const addJob = (newJob) => {
    const jobToAdd = {
      ...newJob,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };

    const updatedJobs = [...jobs, jobToAdd];
    setJobs(updatedJobs);
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
    return jobToAdd;
  };

  const value = {
    jobs,
    addJob,
  };

  return (
    <JobsContext.Provider value={value}>
      {children}
    </JobsContext.Provider>
  );
};