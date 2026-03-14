export interface User {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
  createdAt?: string | null;
}

export interface Listing {
  id: string;
  userId?: string;
  title: string;
  description: string | null;
  propertyType: string;
  dealType: string;
  price: number;
  currency: string;
  area: number;
  rooms: number;
  floor: number | null;
  totalFloors: number | null;
  address: string;
  city: string;
  district: string | null;
  metroStation?: string | null;
  images: string[];
  published: boolean;
  viewsCount: number;
  createdAt: string;
  user?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl?: string | null;
  };
}

export interface Deal {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  status: string;
  price: number;
  createdAt: string;
  listing: {
    id: string;
    title: string;
    address: string;
    city: string;
  };
  buyer: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
  seller: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
}
