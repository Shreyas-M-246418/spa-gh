import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useJobs } from '../contexts/JobsContext';
import { Plus } from 'lucide-react';
import JobDetails from './JobDetails';
import '../styles/JobsPage.css';

const JobsPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    employmentType: []
  });

  useEffect(() => {
    // Load jobs from localStorage for GitHub Pages demo
    const savedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    setJobs(savedJobs);
  }, []);

  const handleFilterChange = (e, field) => {
    setFilters(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleEmploymentTypeChange = (type) => {
    setFilters(prev => ({
      ...prev,
      employmentType: prev.employmentType.includes(type)
        ? prev.employmentType.filter(t => t !== type)
        : [...prev.employmentType, type]
    }));
  };

  const filteredJobs = jobs.filter(job => {
    const titleMatch = job.title.toLowerCase().includes(filters.title.toLowerCase()) ||
      job.companyName.toLowerCase().includes(filters.title.toLowerCase());
    const locationMatch = job.location.toLowerCase().includes(filters.location.toLowerCase());
    const typeMatch = filters.employmentType.length === 0 || 
      filters.employmentType.includes(job.employmentType);

    return titleMatch && locationMatch && typeMatch;
  });

  return (
    <div className="dashboard-container">
      <div className="search-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by title or company"
            value={filters.title}
            onChange={(e) => handleFilterChange(e, 'title')}
            className="search-input"
          />
          <input
            type="text"
            placeholder="Location"
            value={filters.location}
            onChange={(e) => handleFilterChange(e, 'location')}
            className="search-input"
          />
        </div>
      </div>

      <div className="main-content">
        <div className="filters-sidebar">
          <div className="filter-section">
            <h3>Employment Type</h3>
            {['Full time', 'Part time', 'Internship'].map(type => (
              <label key={type} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.employmentType.includes(type.toLowerCase())}
                  onChange={() => handleEmploymentTypeChange(type.toLowerCase())}
                  className="checkbox-input"
                />
                <span className="checkbox-text">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="jobs-content">
          <div className="jobs-header">
            <h2>My Posted Jobs</h2>
            <div className="header-buttons">
              <button onClick={() => navigate('/hire')} className="post-job-btn">
                <Plus size={20} />
                Post New Job
              </button>
            </div>
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
                  <span className="employment-type-badge" data-type={job.employmentType}>
                    {job.employmentType}
                  </span>
                </div>
                <p className="company-name">{job.companyName}</p>
                <p className="job-description">{job.description.substring(0, 150)}...</p>
                <div className="job-location">
                  <span>{job.location}</span>
                  <span>{job.workType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedJob && (
        <JobDetails 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)}
        />
      )}

      <button 
        className="floating-add-button"
        onClick={() => navigate('/hire')}
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default JobsPage;