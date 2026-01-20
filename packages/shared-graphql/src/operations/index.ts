export const USER_FRAGMENT = `
  fragment UserFields on User {
    id
    email
    name
    createdAt
    updatedAt
  }
`;

export const POST_FRAGMENT = `
  fragment PostFields on Post {
    id
    title
    content
    published
    authorId
    createdAt
    updatedAt
  }
`;
