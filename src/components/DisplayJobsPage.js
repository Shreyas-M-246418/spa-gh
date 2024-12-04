import React, { useState } from 'react';
import { useJobs } from '../contexts/JobsContext';
import JobDetails from './JobDetails';
import '../styles/DisplayJobsPage.css';

const DisplayJobsPage = () => {
  const { jobs } = useJobs();
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    employmentType: '',
    workType: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredJobs = jobs.filter(job => {
    const searchMatch = job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                       job.companyName.toLowerCase().includes(filters.search.toLowerCase());
    const locationMatch = !filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase());
    const employmentTypeMatch = !filters.employmentType || job.employmentType === filters.employmentType;
    const workTypeMatch = !filters.workType || job.workType === filters.workType;

    return searchMatch && locationMatch && employmentTypeMatch && workTypeMatch;
  });

  return (
    <div className="display-jobs-page">
      <div className="filters-section">
        <input
          type="text"
          name="search"
          placeholder="Search jobs or companies..."
          value={filters.search}
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
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="contract">Contract</option>
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
          <option value="on-site">On Site</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>

      <div className="jobs-grid">
        {filteredJobs.map(job => (
          <div 
            key={job.id} 
            className="job-card"
            onClick={() => setSelectedJob(job)}
          >
            <div className="job-card-header">
              <h3>{job.title}</h3>
              <span className="company-name">{job.companyName}</span>
            </div>
            <div className="job-card-body">
              <p className="location">{job.location}</p>
              <p className="employment-type">{job.employmentType}</p>
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

      {selectedJob && (
        <JobDetails 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} 
        />
      )}
    </div>
  );
};

export default DisplayJobsPage;