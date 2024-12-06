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
    <div className="page-container">
      <div className="search-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Title/skill or Company"
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
          <div className="filter-dropdown">
            <button className={`filter-button ${filters.userType.length > 0 ? 'has-selection' : ''}`}>
              User Type {filters.userType.length > 0 && `(${filters.userType.length})`}
            </button>
            <div className="dropdown-content">
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="fresher"
                  checked={filters.userType.includes('fresher')}
                  onChange={handleUserTypeChange}
                />
                Fresher
              </label>
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="professional"
                  checked={filters.userType.includes('professional')}
                  onChange={handleUserTypeChange}
                />
                Professional
              </label>
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="student"
                  checked={filters.userType.includes('student')}
                  onChange={handleUserTypeChange}
                />
                College Student
              </label>
              <button className="clear-filter" onClick={() => handleClearFilter('userType')}>
                Clear
              </button>
            </div>
          </div>
          <button onClick={clearFilters} className="clear-all-btn">
            clear all
          </button>
        </div>
      </div>
      
      <div className="main-content">
        <div className="filters-sidebar">
          <div className="filter-section">
            <h3>Employment Type</h3>
            {['Full time', 'Internship', 'Part time'].map(type => (
              <label 
                key={type} 
                className="employment-type-label"
                data-type={type.toLowerCase()}
              >
                <input
                  type="checkbox"
                  className="employment-type-checkbox"
                  data-type={type.toLowerCase()}
                  value={type.toLowerCase()}
                  checked={filters.employmentType.includes(type.toLowerCase())}
                  onChange={handleEmploymentTypeChange}
                />
                {type}
              </label>
            ))}
          </div>
          <div className="filter-section">
            <h3>Work Type</h3>
            {['On site', 'Remote', 'Hybrid', 'Field Work'].map(type => (
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
        
        <div className="jobs-container">
          <div className="jobs-header">
            <h1>Your Posted Jobs</h1>
            <p className="results-count">
              {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} posted
            </p>
          </div>
          <div className="jobs-grid">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="job-card"
                data-employment-type={job.employmentType?.toLowerCase()}
              >
                <div className="employment-type-badge" data-type={job.employmentType?.toLowerCase()}>
                  {job.employmentType}
                </div>
                <h3>{job.title}</h3>
                <p>{job.description}</p>
                <div className="job-details">
                  {job.location && <span className="location">{job.location}</span>}
                  {job.salary && <span className="salary">{job.salary}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;