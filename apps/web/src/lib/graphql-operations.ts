export const LISTING_FIELDS = `
  id
  title
  description
  propertyType
  dealType
  price
  currency
  area
  rooms
  floor
  totalFloors
  address
  city
  district
  metroStation
  images
  published
  viewsCount
  createdAt
`;

export const LISTINGS_QUERY = `
  query Listings($published: Boolean, $city: String) {
    listings(published: $published, city: $city) {
      ${LISTING_FIELDS}
    }
  }
`;

export const LISTING_QUERY = `
  query Listing($id: ID!) {
    listing(id: $id) {
      ${LISTING_FIELDS}
      userId
      user {
        id
        firstName
        lastName
        profileImageUrl
      }
    }
  }
`;

export const MY_LISTINGS_QUERY = `
  query MyListings {
    myListings {
      ${LISTING_FIELDS}
    }
  }
`;

export const CREATE_LISTING_MUTATION = `
  mutation CreateListing($input: CreateListingInput!) {
    createListing(input: $input) {
      id
      title
    }
  }
`;

export const PUBLISH_LISTING_MUTATION = `
  mutation PublishListing($id: ID!, $published: Boolean!) {
    publishListing(id: $id, published: $published) {
      id
      published
    }
  }
`;

export const DELETE_LISTING_MUTATION = `
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`;

export const FAVORITE_LISTINGS_QUERY = `
  query FavoriteListings {
    favoriteListings {
      id
      title
      description
      propertyType
      dealType
      price
      currency
      area
      rooms
      floor
      totalFloors
      address
      city
      district
      images
    }
  }
`;

export const IS_FAVORITE_QUERY = `
  query IsFavorite($listingId: String!) {
    isFavorite(listingId: $listingId)
  }
`;

export const ADD_FAVORITE_MUTATION = `
  mutation AddToFavorites($listingId: String!) {
    addToFavorites(listingId: $listingId) { id }
  }
`;

export const REMOVE_FAVORITE_MUTATION = `
  mutation RemoveFromFavorites($listingId: String!) {
    removeFromFavorites(listingId: $listingId) {
      id
    }
  }
`;

export const MY_DEALS_QUERY = `
  query MyDeals {
    myDeals {
      id
      listingId
      buyerId
      sellerId
      status
      price
      createdAt
      listing {
        id
        title
        address
        city
      }
      buyer {
        id
        firstName
        lastName
        email
      }
      seller {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const PROFILE_STATS_QUERY = `
  query ProfileStats {
    favoriteListings {
      id
    }
    myDeals {
      id
    }
    myListings {
      id
    }
  }
`;

export const UPDATE_USER_MUTATION = `
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      firstName
      lastName
      phone
      profileImageUrl
    }
  }
`;
