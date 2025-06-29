// src/services/agent_service.ts

import { Agent, CreateAgent } from "../types";
import api from "../api"; // Assuming you have an axios instance in api.ts

// Create a new agent
export const createAgent = async (agent: CreateAgent): Promise<Agent> => {
  const response = await api.post<Agent>("/agents/", agent);
  return response.data;
};

// Get all agents with pagination
export const readAgents = async (
  skip: number = 0,
  limit: number = 100
): Promise<Agent[]> => {
  const response = await api.get<Agent[]>(
    `/agents/?skip=${skip}&limit=${limit}`
  );
  return response.data;
};

// Get an agent by ID
export const readAgentById = async (agentId: number): Promise<Agent> => {
  const response = await api.get<Agent>(`/agents/${agentId}`);
  return response.data;
};

// Get agent password by email and password
export const getAgentPasswordByEmail = async (
  agentEmail: string,
  agentPassword: string
): Promise<Agent> => {
  const response = await api.get<Agent>(
    `/agents/password/${agentEmail}/${agentPassword}`
  );
  return response.data;
};

// Get an agent by email
export const getAgentByEmail = async (email: string): Promise<Agent> => {
  const response = await api.get<Agent>(`/agents/email/${email}`);
  return response.data;
};


// Get all agents by OfficeID
export const getAgentsByOfficeId = async (officeId: number): Promise<Agent[]> => {
  const response = await api.get<Agent[]>(`/agents/office/${officeId}`);
  return response.data;
};