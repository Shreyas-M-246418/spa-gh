import React from 'react';
import '../styles/JobDetails.css';

const JobDetails = ({ job, onClose }) => {
  return (
    <div className="job-details-overlay" onClick={onClose}>
      <div className="job-details-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <div className="job-header">
          <div className="company-info">
            <div className="company-logo">
              {job.companyName?.charAt(0)}
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
        </div>

        <div className="job-description">
          <h3>Job Description</h3>
          <p>{job.description}</p>
        </div>

        <div className="job-footer">
          <p>Posted by: {job.createdBy}</p>
          <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="apply-button">
            Apply
          </a>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;