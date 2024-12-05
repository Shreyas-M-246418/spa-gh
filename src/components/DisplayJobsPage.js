import React, { useState } from 'react';
import { useJobs } from '../contexts/JobsContext';
import JobDetails from './JobDetails';
import '../styles/DisplayJobsPage.css';

const DisplayJobsPage = () => {
  const { jobs } = useJobs();
  const [selectedJob, setSelectedJob] = useState(null);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    domain: [],
    employmentType: [],
    workType: []
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setShowFullScreen(true);
  };

  const handleCloseFullScreen = () => {
    setSelectedJob(null);
    setShowFullScreen(false);
  };

  const filteredJobs = jobs.filter(job => {
    const searchMatch = !filters.title || 
      job.title.toLowerCase().includes(filters.title.toLowerCase()) ||
      job.companyName?.toLowerCase().includes(filters.title.toLowerCase());
    
    const locationMatch = !filters.location || 
      job.location.toLowerCase().includes(filters.location.toLowerCase());
    
    const employmentTypeMatch = filters.employmentType.length === 0 || 
      filters.employmentType.includes(job.employmentType);
    
    const workTypeMatch = filters.workType.length === 0 || 
      filters.workType.includes(job.workType);

    return searchMatch && locationMatch && employmentTypeMatch && workTypeMatch;
  });

  return (
    <div className="display-jobs-page">
      <div className="filters-section">
        <input
          type="text"
          name="title"
          placeholder="Search jobs or companies..."
          value={filters.title}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <select
          name="employmentType"
          value={filters.employmentType}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">Employment Type</option>
          <option value="full time">Full Time</option>
          <option value="part time">Part Time</option>
          <option value="internship">Internship</option>
        </select>
        <select
          name="workType"
          value={filters.workType}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">Work Type</option>
          <option value="remote">Remote</option>
          <option value="on site">On Site</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>

      <div className="jobs-grid">
        {filteredJobs.map(job => (
          <div 
            key={job.id} 
            className="job-card"
            onClick={() => handleJobClick(job)}
          >
            <div className="job-card-header">
              <div className="employment-type-badge" data-type={job.employmentType?.toLowerCase()}>
                {job.employmentType}
              </div>
              <h3>{job.title}</h3>
              <p className="company-name">{job.companyName}</p>
            </div>
            <div className="job-card-body">
              <div className="job-meta">
                <span>{job.location}</span>
                <span>{job.domain}</span>
              </div>
            </div>
            <div className="job-card-footer">
              <span className="work-type">{job.workType}</span>
              <span className="posted-date">
                {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showFullScreen && selectedJob && (
        <JobDetails 
          job={selectedJob} 
          onClose={handleCloseFullScreen}
        />
      )}
    </div>
  );
};

export default DisplayJobsPage;