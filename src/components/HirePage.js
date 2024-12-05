import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useJobs } from '../contexts/JobsContext';
import '../styles/HirePage.css';

const HirePage = () => {
  const navigate = useNavigate();
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


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send to a server
    // For GitHub Pages demo, we could store in localStorage
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const newJob = {
      ...formData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    jobs.push(newJob);
    localStorage.setItem('jobs', JSON.stringify(jobs));
    navigate('/jobs');
  };

  return (
    <div className="hire-page">
      <div className="hire-card">
        <div className="hire-card-header">
          <h2>Post a New Job</h2>
          <button className="close-button" onClick={() => navigate('/jobs')}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="hire-card-content">
          <div className="form-grid">
            {/* Left Column */}
            <div className="form-column">
              <div className="form-group">
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Company Name"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Location"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group split">
                <select
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="">Select Domain</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Full Stack">Full Stack</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Mobile">Mobile</option>
                  <option value="UI/UX">UI/UX</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Machine Learning">Machine Learning</option>
                </select>

                <select
                  name="workType"
                  value={formData.workType}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="">Work Type</option>
                  <option value="remote">Remote</option>
                  <option value="on site">On-site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div className="form-group">
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="">Employment Type</option>
                  <option value="full time">Full Time</option>
                  <option value="part time">Part Time</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div className="form-group">
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="">User Type</option>
                  <option value="student">Student</option>
                  <option value="fresher">Fresher</option>
                  <option value="professional">Professional</option>
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
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Job Description"
                  required
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
                  type="url"
                  name="applyLink"
                  value={formData.applyLink}
                  onChange={handleChange}
                  placeholder="Application URL"
                  required
                  className="form-input"
                />
              </div>

              <button type="submit" className="create-button">
                Post Job
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HirePage;