import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useJobs } from '../contexts/JobsContext';
import '../styles/HirePage.css';

const HirePage = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    location: '',
    domain: '',
    workType: '',
    employmentType: '',
    userType: '',
    title: '',
    description: '',
    salaryRange: '',
    applyLink: '',
  });

  const { user } = useAuth();
  const { addJob } = useJobs();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const jobData = {
      ...formData,
      userId: user.id,
      createdBy: user.name || user.username,
      createdAt: new Date().toISOString(),
    };

    addJob(jobData);
    navigate('/jobs');
  };

  return (
    <div className="hire-page">
      <div className="hire-card">
        <div className="hire-card-header">
          <h2>Creating New Job</h2>
          <button className="close-button" onClick={() => navigate('/jobs')}>×</button>
        </div>
        
        <div className="hire-card-content">
          <div className="form-grid">
            {/* Left Column */}
            <div className="form-column">
              <div className="form-group">
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Company Name"
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Location"
                />
              </div>

              <div className="form-group split">
                <select
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Domain</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Full Stack">Full Stack</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Mobile">Mobile</option>
                  <option value="UI/UX">UI/UX</option>
                </select>

                <select
                  name="workType"
                  value={formData.workType}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Work Type</option>
                  <option value="remote">Remote</option>
                  <option value="on site">Onsite</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div className="form-group">
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Employment Type</option>
                  <option value="full time">Full Time</option>
                  <option value="part time">Part Time</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="form-column">
              <div className="form-group">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Job Title"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Job Description"
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="salaryRange"
                  value={formData.salaryRange}
                  onChange={handleChange}
                  placeholder="Salary Range"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="applyLink"
                  value={formData.applyLink}
                  onChange={handleChange}
                  placeholder="Application Link"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <button onClick={handleSubmit} className="create-button">
                  Create Job
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HirePage;