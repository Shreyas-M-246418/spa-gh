import React, { useEffect } from 'react';
import '../styles/JobDetails.css';

const JobDetails = ({ job, onClose }) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.classList.contains('job-details-overlay')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="job-details-overlay">
      <div className="job-details-container">
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="company-info">
          <div className="company-logo">
            {job.companyName?.charAt(0) || 'C'}
          </div>
          <div>
            <h2>{job.title}</h2>
            <p className="company-name">{job.companyName}</p>
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
          {job.salaryRange && (
            <div className="meta-item">
              <span className="meta-label">Salary Range</span>
              <span className="meta-value">{job.salaryRange}</span>
            </div>
          )}
        </div>

        <div className="job-description">
          <h3>Job Description</h3>
          <p>{job.description}</p>
        </div>

        <div className="job-footer">
          <div className="job-info">
            <p>Posted by: {job.createdBy}</p>
            <p>Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>
          </div>
          {job.applyLink && (
            <a 
              href={job.applyLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="apply-button"
            >
              Apply Now
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;