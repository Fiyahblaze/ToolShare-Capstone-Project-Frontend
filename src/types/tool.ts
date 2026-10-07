export interface Tool {
  _id: string;
  owner: string | {
    _id: string;
    name: string;
  };
  name: string;
  description: string;
  category: string;
  condition: string;
  dailyRate: number;
  location: string;
  imageUrl: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ToolsResponse {
  tools: Tool[];
}

export interface ToolResponse {
  tool: Tool;
}

export interface ToolFormValues {
  name: string;
  description: string;
  category: string;
  condition: string;
  dailyRate: number;
  location: string;
  imageUrl: string;
  available: boolean;
}