// Custom GraphQL operations — hand-written by agents.
// Use `extend type Query` / `extend type Mutation` to add or override fields.
// Default CRUD is auto-generated. Fields listed in overrides.json are excluded
// from the generated SDL so they can be re-declared here with different signatures.

export const customTypeDefs = /* GraphQL */ `
  type LikeToggleResult {
    liked: Boolean!
    likeCount: Int!
  }

  extend type Query {
    posts(published: Boolean): [Post!]!
    postsByTag(name: String!): [Post!]!
  }

  extend type Mutation {
    register(email: String!, name: String!, role: Role): User!
    createPost(title: String!, content: String!): Post!
    publishPost(id: ID!): Post!
    deletePost(id: ID!): Post!
    addComment(postId: ID!, body: String!): Comment!
    addTagToPost(postId: ID!, tagName: String!): Post!
    removeTagFromPost(postId: ID!, tagName: String!): Post!
    toggleLikePost(postId: ID!): LikeToggleResult!
  }

  extend type Post {
    likeCount: Int!
    viewerHasLiked: Boolean!
  }
`
