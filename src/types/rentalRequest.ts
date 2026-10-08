export type RentalStatus =
  | "pending"
  | "approved"
  | "declined"
  | "cancelled"
  | "returned";

export interface RentalFormValues {
  startDate: string;
  endDate: string;
  message: string;
}

export interface RentalRequest {
  _id: string;
  tool:
    | string
    | {
        _id: string;
        name: string;
        dailyRate: number;
        location: string;
        imageUrl: string;
      };
  borrower: string | { _id: string; name: string };
  owner: string | { _id: string; name: string };
  startDate: string;
  endDate: string;
  message: string;
  status: RentalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RentalResponse {
  message: string;
  request: RentalRequest;
}

export interface RentalRequestsResponse {
  requests: RentalRequest[];
}

