import React from 'react';
import { useParams } from 'react-router-dom';

const Analysis = () => {
  const { analysisId } = useParams();
  return <div><h1>Analysis Results: {analysisId}</h1></div>;
};

export default Analysis;
