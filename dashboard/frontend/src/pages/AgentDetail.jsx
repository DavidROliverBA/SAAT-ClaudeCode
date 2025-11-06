import React from 'react';
import { useParams } from 'react-router-dom';

const AgentDetail = () => {
  const { agentId } = useParams();
  return <div><h1>Agent Detail: {agentId}</h1></div>;
};

export default AgentDetail;
