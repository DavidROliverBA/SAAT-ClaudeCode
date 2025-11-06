import React from 'react';
import { useParams } from 'react-router-dom';

const ProjectDetail = () => {
  const { projectId } = useParams();

  return (
    <div>
      <h1>Project Detail</h1>
      <p>Project ID: {projectId}</p>
      <p>This page will show project details, files, and allow running agents.</p>
    </div>
  );
};

export default ProjectDetail;
