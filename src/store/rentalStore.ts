import { create } from 'zustand';

export interface Rental {
  id: string;
  toolId: string;
  toolTitle: string;
  toolImage: string;
  renterId: string;
  renterName: string;
  ownerId: string;
  ownerName: string;
  startDate: string;
  endDate: string;
  totalCost: number;
  deposit: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  contract?: {
    id: string;
    terms: string;
    signedByOwner: boolean;
    signedByRenter: boolean;
    createdAt: string;
  };
  paymentData?: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    paymentMethod: string;
    last4?: string;
    created: string;
    description: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface RentalState {
  rentals: Rental[];
  activeRentals: Rental[];
  addRental: (rental: Rental) => void;
  updateRental: (id: string, updates: Partial<Rental>) => void;
  signContract: (rentalId: string, userType: 'owner' | 'renter') => void;
  getUserRentals: (userId: string) => Rental[];
  getOwnerRentals: (ownerId: string) => Rental[];
}

const mockRentals: Rental[] = [
  {
    id: '1',
    toolId: '1',
    toolTitle: 'DeWalt 20V Cordless Drill',
    toolImage: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400',
    renterId: '1',
    renterName: 'John Doe',
    ownerId: '2',
    ownerName: 'Mike Johnson',
    startDate: '2024-01-20',
    endDate: '2024-01-22',
    totalCost: 50,
    deposit: 100,
    status: 'active',
    contract: {
      id: 'contract-1',
      terms: 'Standard rental agreement for power tools...',
      signedByOwner: true,
      signedByRenter: true,
      createdAt: '2024-01-19'
    },
    paymentData: {
      id: 'payment_1',
      amount: 150,
      currency: 'usd',
      status: 'succeeded',
      paymentMethod: 'card',
      last4: '4242',
      created: '2024-01-19T10:30:00Z',
      description: 'Rental payment for DeWalt Drill'
    },
    createdAt: '2024-01-19',
    updatedAt: '2024-01-19'
  }
];

export const useRentalStore = create<RentalState>((set, get) => ({
  rentals: mockRentals,
  activeRentals: mockRentals.filter(r => r.status === 'active'),
  
  addRental: (rental) => set((state) => ({ 
    rentals: [...state.rentals, rental],
    activeRentals: rental.status === 'active' 
      ? [...state.activeRentals, rental] 
      : state.activeRentals
  })),
  
  updateRental: (id, updates) => set((state) => {
    const updatedRentals = state.rentals.map(rental => 
      rental.id === id ? { ...rental, ...updates } : rental
    );
    
    return {
      rentals: updatedRentals,
      activeRentals: updatedRentals.filter(r => r.status === 'active')
    };
  }),

  signContract: (rentalId, userType) => set((state) => {
    const updatedRentals = state.rentals.map(rental => {
      if (rental.id === rentalId && rental.contract) {
        const updatedContract = {
          ...rental.contract,
          signedByOwner: userType === 'owner' ? true : rental.contract.signedByOwner,
          signedByRenter: userType === 'renter' ? true : rental.contract.signedByRenter
        };
        return {
          ...rental,
          contract: updatedContract
        };
      }
      return rental;
    });

    return {
      rentals: updatedRentals,
      activeRentals: updatedRentals.filter(r => r.status === 'active')
    };
  }),
  
  getUserRentals: (userId) => {
    return get().rentals.filter(rental => rental.renterId === userId);
  },
  
  getOwnerRentals: (ownerId) => {
    return get().rentals.filter(rental => rental.ownerId === ownerId);
  }
}));