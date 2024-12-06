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
      const response = await fetch('https://api.github.com/repos/Shreyas-M-246418/spa-gh/contents/src/data/jobs.json');
      const data = await response.json();
      const content = JSON.parse(atob(data.sha ? data.content : 'eyJqb2JzIjpbXX0=')); // Default to empty jobs array
      setJobs(content.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [user]);

  const addJob = async (newJob) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    const githubToken = sessionStorage.getItem('github_token');
    if (!githubToken) {
      return { success: false, error: 'GitHub token not available. Please log in again.' };
    }

    const jobToAdd = {
      ...newJob,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      createdBy: user.uid
    };

    try {
      const response = await fetch('https://api.github.com/repos/Shreyas-M-246418/spa-gh/contents/src/data/jobs.json', {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`GitHub API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      const currentContent = JSON.parse(atob(data.content));
      const existingJobs = currentContent.jobs || [];

      const updatedContent = {
        jobs: [...existingJobs, jobToAdd]
      };

      // Update file in repository
      const updateResponse = await fetch('https://api.github.com/repos/Shreyas-M-246418/spa-gh/contents/src/data/jobs.json', {
        method: 'PUT',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Add new job',
          content: btoa(JSON.stringify(updatedContent, null, 2)),
          sha: data.sha
        })
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(`Failed to create job: ${updateResponse.status} - ${JSON.stringify(errorData)}`);
      }

      setJobs(updatedContent.jobs);
      return { success: true, job: jobToAdd };
    } catch (error) {
      console.error('Error adding job:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to add job to repository'
      };
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