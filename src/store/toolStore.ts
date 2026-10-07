import { create } from 'zustand';

export interface Tool {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  brand?: string;
  model?: string;
  year?: string;
  condition?: string;
  images: string[];
  video?: string;
  price: {
    hourly?: number;
    daily: number;
    weekly?: number;
    monthly?: number;
  };
  deposit: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: [number, number];
  };
  owner: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    responseRate: number;
    verified?: boolean;
  };
  availability: {
    available: boolean;
    calendar: string[];
    seasonalAvailability?: string[];
    minimumRental?: number;
    maximumRental?: number;
    advanceNotice?: number;
  };
  delivery?: {
    available: boolean;
    radius: number;
    fee: number;
  };
  pickup?: {
    available: boolean;
  };
  features?: {
    instantBooking: boolean;
    insurance: boolean;
    instructionsIncluded: boolean;
    videoTutorial: boolean;
  };
  specifications?: {
    powerSource?: string;
    weight?: string;
    dimensions?: string;
    experienceLevel?: string;
  };
  maintenance?: {
    schedule?: string;
    lastMaintenance?: string;
    warrantyInfo?: string;
  };
  accessories?: string[];
  rules: string[];
  safetyRequirements?: string[];
  cancellationPolicy?: string;
  supportContact?: string;
  verificationData?: any; // Store ID verification data
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ToolState {
  tools: Tool[];
  searchQuery: string;
  selectedCategory: string;
  priceRange: [number, number];
  location: string;
  setTools: (tools: Tool[]) => void;
  addTool: (tool: Tool) => void;
  updateTool: (id: string, updates: Partial<Tool>) => void;
  deleteTool: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setLocation: (location: string) => void;
  getFilteredTools: () => Tool[];
}

// Default blank avatar for tool owners
const DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9Ijc1IiBjeT0iNjAiIHI9IjI1IiBmaWxsPSIjOUI5QkEzIi8+CjxwYXRoIGQ9Ik0zMCAxMjBDMzAgMTA0LjUzNiA0Mi41MzYgOTIgNTggOTJIOTJDMTA3LjQ2NCA5MiAxMjAgMTA0LjUzNiAxMjAgMTIwVjE1MEgzMFYxMjBaIiBmaWxsPSIjOUI5QkEzIi8+Cjwvc3ZnPgo=';

// Mock data with enhanced properties
const mockTools: Tool[] = [
  {
    id: '1',
    title: 'DeWalt 20V Cordless Drill',
    description: 'Professional grade cordless drill with 2 batteries and charger. Perfect for home projects and professional use. High torque motor with 15 clutch settings.',
    category: 'Power Tools',
    subcategory: 'Drills',
    brand: 'DeWalt',
    model: 'DCD771C2',
    year: '2023',
    condition: 'excellent',
    images: [
      'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    price: {
      hourly: 8,
      daily: 25,
      weekly: 150,
      monthly: 500
    },
    deposit: 100,
    location: {
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      coordinates: [-122.4194, 37.7749]
    },
    owner: {
      id: '2',
      name: 'Mike Johnson',
      avatar: DEFAULT_AVATAR, // Use default blank avatar
      rating: 4.9,
      responseRate: 95,
      verified: true
    },
    availability: {
      available: true,
      calendar: [],
      seasonalAvailability: ['Spring', 'Summer', 'Fall', 'Winter'],
      minimumRental: 1,
      maximumRental: 14,
      advanceNotice: 24
    },
    delivery: {
      available: true,
      radius: 15,
      fee: 10
    },
    pickup: {
      available: true
    },
    features: {
      instantBooking: true,
      insurance: true,
      instructionsIncluded: true,
      videoTutorial: false
    },
    specifications: {
      powerSource: 'battery',
      weight: '3.4 lbs',
      dimensions: '8.5 x 3.1 x 9.1 inches',
      experienceLevel: 'beginner'
    },
    maintenance: {
      lastMaintenance: '2024-01-01',
      warrantyInfo: '3 years manufacturer warranty'
    },
    accessories: ['Batteries', 'Charger', 'Case/Bag', 'Manual', 'Extra Bits/Blades'],
    rules: [
      'Return clean and in same condition',
      'No lending to others',
      'Report any damage immediately',
      'Follow all safety guidelines'
    ],
    safetyRequirements: [
      'Wear safety glasses',
      'Read manual before use',
      'Check battery charge before starting'
    ],
    cancellationPolicy: 'flexible',
    supportContact: '+1 (555) 123-4567',
    rating: 4.8,
    reviewCount: 12,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Professional Hair Dryer',
    description: 'Salon-quality hair dryer with multiple heat settings and attachments. Perfect for styling events and professional use.',
    category: 'Beauty Tools',
    subcategory: 'Hair Dryers',
    brand: 'Dyson',
    model: 'Supersonic',
    year: '2023',
    condition: 'excellent',
    images: [
      'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    price: {
      hourly: 5,
      daily: 15,
      weekly: 80,
      monthly: 250
    },
    deposit: 50,
    location: {
      address: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      coordinates: [-118.2437, 34.0522]
    },
    owner: {
      id: '3',
      name: 'Sarah Wilson',
      avatar: DEFAULT_AVATAR, // Use default blank avatar
      rating: 4.7,
      responseRate: 88,
      verified: true
    },
    availability: {
      available: true,
      calendar: [],
      seasonalAvailability: ['Spring', 'Summer', 'Fall', 'Winter'],
      minimumRental: 1,
      maximumRental: 7,
      advanceNotice: 12
    },
    delivery: {
      available: false,
      radius: 0,
      fee: 0
    },
    pickup: {
      available: true
    },
    features: {
      instantBooking: false,
      insurance: false,
      instructionsIncluded: true,
      videoTutorial: true
    },
    specifications: {
      powerSource: 'corded',
      weight: '1.8 lbs',
      dimensions: '9.6 x 3.8 x 3.1 inches',
      experienceLevel: 'beginner'
    },
    maintenance: {
      lastMaintenance: '2024-01-10',
      warrantyInfo: '2 years manufacturer warranty'
    },
    accessories: ['Manual', 'Styling Tools', 'Case/Bag'],
    rules: [
      'Clean after use',
      'Handle with care',
      'Return all attachments',
      'No water exposure'
    ],
    safetyRequirements: [
      'Keep away from water',
      'Use heat protection',
      'Check cord before use'
    ],
    cancellationPolicy: 'moderate',
    supportContact: 'sarah.wilson@email.com',
    rating: 4.6,
    reviewCount: 8,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  },
  {
    id: '3',
    title: 'Lawn Mower - Self Propelled',
    description: 'Gas-powered self-propelled lawn mower. Great for medium to large yards. Includes grass catcher and mulching capability.',
    category: 'Garden Tools',
    subcategory: 'Lawn Mowers',
    brand: 'Honda',
    model: 'HRR216VKA',
    year: '2022',
    condition: 'good',
    images: [
      'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    price: {
      daily: 40,
      weekly: 200,
      monthly: 600
    },
    deposit: 150,
    location: {
      address: '789 Pine St',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      coordinates: [-97.7431, 30.2672]
    },
    owner: {
      id: '4',
      name: 'David Brown',
      avatar: DEFAULT_AVATAR, // Use default blank avatar
      rating: 4.9,
      responseRate: 92,
      verified: true
    },
    availability: {
      available: true,
      calendar: [],
      seasonalAvailability: ['Spring', 'Summer', 'Fall'],
      minimumRental: 1,
      maximumRental: 30,
      advanceNotice: 48
    },
    delivery: {
      available: true,
      radius: 20,
      fee: 25
    },
    pickup: {
      available: true
    },
    features: {
      instantBooking: false,
      insurance: true,
      instructionsIncluded: true,
      videoTutorial: true
    },
    specifications: {
      powerSource: 'gas',
      weight: '84 lbs',
      dimensions: '25 x 22 x 40 inches',
      experienceLevel: 'intermediate'
    },
    maintenance: {
      schedule: 'Monthly oil change, seasonal tune-up',
      lastMaintenance: '2024-01-05',
      warrantyInfo: '3 years manufacturer warranty'
    },
    accessories: ['Manual', 'Grass catcher', 'Mulching kit', 'Oil'],
    rules: [
      'Fill with gas before return',
      'Clean grass clippings',
      'No wet grass cutting',
      'Check oil level before use'
    ],
    safetyRequirements: [
      'Wear closed-toe shoes',
      'Clear debris from lawn',
      'Never remove safety guards',
      'Keep hands and feet away from blade'
    ],
    cancellationPolicy: 'moderate',
    supportContact: '+1 (555) 987-6543',
    rating: 4.9,
    reviewCount: 15,
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08'
  }
];

export const useToolStore = create<ToolState>((set, get) => ({
  tools: mockTools,
  searchQuery: '',
  selectedCategory: '',
  priceRange: [0, 500],
  location: '',
  
  setTools: (tools) => set({ tools }),
  
  addTool: (tool) => set((state) => ({ tools: [...state.tools, tool] })),
  
  updateTool: (id, updates) => set((state) => ({
    tools: state.tools.map(tool => tool.id === id ? { ...tool, ...updates } : tool)
  })),
  
  deleteTool: (id) => set((state) => ({
    tools: state.tools.filter(tool => tool.id !== id)
  })),
  
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setPriceRange: (priceRange) => set({ priceRange }),
  setLocation: (location) => set({ location }),
  
  getFilteredTools: () => {
    const { tools, searchQuery, selectedCategory, priceRange, location } = get();
    
    return tools.filter(tool => {
      const matchesSearch = !searchQuery || 
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.subcategory?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || tool.category === selectedCategory;
      
      const matchesPrice = tool.price.daily >= priceRange[0] && tool.price.daily <= priceRange[1];
      
      const matchesLocation = !location || 
        tool.location.city.toLowerCase().includes(location.toLowerCase()) ||
        tool.location.state.toLowerCase().includes(location.toLowerCase()) ||
        tool.location.zipCode.includes(location);
      
      return matchesSearch && matchesCategory && matchesPrice && matchesLocation;
    });
  }
}));