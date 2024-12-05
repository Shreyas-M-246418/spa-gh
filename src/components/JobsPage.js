import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useJobs } from '../contexts/JobsContext';
import { Plus } from 'lucide-react';
import JobDetails from './JobDetails';
import '../styles/JobsPage.css';

const JobsPage = () => {
  const { user } = useAuth();
  const { jobs } = useJobs();
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    domain: [],
    employmentType: [],
    workType: []
  });

  // Filter jobs to show only those created by the current user
  const userJobs = jobs.filter(job => job.userId === user.id);

  const handleFilterChange = (e, field) => {
    setFilters({
      ...filters,
      [field]: e.target.value
    });
  };

  const handleDomainChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({
      ...prev,
      domain: e.target.checked 
        ? [...prev.domain, value]
        : prev.domain.filter(item => item !== value)
    }));
  };

  const handleEmploymentTypeChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({
      ...prev,
      employmentType: e.target.checked 
        ? [...prev.employmentType, value]
        : prev.employmentType.filter(item => item !== value)
    }));
  };

  const handleWorkTypeChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({
      ...prev,
      workType: e.target.checked 
        ? [...prev.workType, value]
        : prev.workType.filter(item => item !== value)
    }));
  };

  const clearFilters = () => {
    setFilters({
      title: '',
      location: '',
      domain: [],
      employmentType: [],
      workType: []
    });
  };

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
          <button onClick={clearFilters} className="clear-all-btn">
            Clear all
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="filters-sidebar">
          <div className="filter-section">
            <h3>Employment Type</h3>
            {['Full time', 'Internship', 'Part time'].map(type => (
              <label key={type} className="employment-type-label">
                <input
                  type="checkbox"
                  value={type.toLowerCase()}
                  checked={filters.employmentType.includes(type.toLowerCase())}
                  onChange={handleEmploymentTypeChange}
                  className="employment-type-checkbox"
                />
                {type}
              </label>
            ))}
          </div>

          <div className="filter-section">
            <h3>Work Type</h3>
            {['Remote', 'On site', 'Hybrid'].map(type => (
              <label key={type}>
                <input
                  type="checkbox"
                  value={type.toLowerCase()}
                  checked={filters.workType.includes(type.toLowerCase())}
                  onChange={handleWorkTypeChange}
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        <div className="jobs-content">
          <div className="jobs-header">
            <h1>My Job Listings</h1>
            <button 
              className="create-job-button"
              onClick={() => navigate('/hire')}
            >
              <Plus size={20} />
              Create New Job
            </button>
          </div>

          <div className="jobs-grid">
            {userJobs.map(job => (
              <div
                key={job.id}
                className="job-card"
                onClick={() => setSelectedJob(job)}
              >
                <div className="employment-type-badge" data-type={job.employmentType?.toLowerCase()}>
                  {job.employmentType}
                </div>
                <h3>{job.title}</h3>
                <p className="company-name">{job.companyName}</p>
                <div className="job-meta">
                  <span>{job.location}</span>
                  <span>{job.domain}</span>
                </div>
              </div>
            ))}
          </div>

          {userJobs.length === 0 && (
            <div className="no-jobs">
              <p>You haven't created any job listings yet.</p>
              <button 
                className="create-first-job"
                onClick={() => navigate('/hire')}
              >
                Create Your First Job
              </button>
            </div>
          )}
        </div>
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

export default JobsPage;