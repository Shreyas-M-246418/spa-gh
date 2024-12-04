import React from 'react';
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
  const [selectedJob, setSelectedJob] = React.useState(null);

  // Filter jobs to show only those created by the current user
  const userJobs = jobs.filter(job => job.userId === user.id);

  return (
    <div className="jobs-page">
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
            <div className="employment-type-badge" data-type={job.employmentType}>
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