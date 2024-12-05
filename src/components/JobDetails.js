import React, { useEffect } from 'react';
import '../styles/JobDetails.css';

const JobDetails = ({ job, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="job-details-overlay" onClick={(e) => {
      if (e.target.className === 'job-details-overlay') onClose();
    }}>
      <div className="job-details-container">
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <div className="job-header">
          <div className="company-info">
            <div className="company-logo">
              {job.companyName?.charAt(0) || 'C'}
            </div>
            <div className="company-details">
              <h2>{job.title}</h2>
              <p className="company-name">{job.companyName}</p>
            </div>
          </div>
        </div>

        <div className="job-meta">
          <div className="meta-item">
            <span className="meta-label">Location</span>
            <span className="meta-value">{job.location}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Employment Type</span>
            <span className="meta-value">{job.employmentType}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Work Type</span>
            <span className="meta-value">{job.workType}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Domain</span>
            <span className="meta-value">{job.domain}</span>
          </div>
          {job.salary && (
            <div className="meta-item">
              <span className="meta-label">Salary Range</span>
              <span className="meta-value">{job.salary}</span>
            </div>
          )}
        </div>

        <div className="job-description">
          <h3>Job Description</h3>
          <p>{job.description}</p>
        </div>

        {job.applyLink && (
          <button 
            className="apply-button"
            onClick={() => window.open(job.applyLink, '_blank')}
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

export default JobDetails;