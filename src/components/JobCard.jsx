

import React from 'react';
import { Link } from 'react-router-dom';

function JobCard({ job }) {
  const getStatusClass = (status) => {
    if (status === 'completed') return 'status-completed';
    if (status === 'in-progress') return 'status-in-progress';
    return 'status-open';
  };

  return (
    <Link to={`/job/${job.id}`} className="job-card">
      <div className="job-card-header">
        <span className="job-card-category">{job.category}</span>
        <span className={`job-card-status ${getStatusClass(job.status)}`}>{job.status}</span>
      </div>
      <h3 className="job-card-title">{job.title}</h3>
      <p className="job-card-client">โดย: {job.clientName}</p>
      <div className="job-card-footer">
        <span className="job-card-budget">฿{job.budget.toLocaleString()}</span>
        <span className="job-card-date">
          {job.createdAt ? new Date(job.createdAt.toDate()).toLocaleDateString('th-TH') : ''}
        </span>
      </div>
    </Link>
  );
}

export default JobCard;