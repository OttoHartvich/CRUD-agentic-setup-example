// Auto-generated — DO NOT EDIT
export const generatedTypeDefs = /* GraphQL */ `
# Auto-generated SDL — DO NOT EDIT
# Custom queries/mutations live in src/schema/custom/typeDefs.custom.ts (use extend type)

scalar JSON

enum Role {
  ADMIN
  AUTHOR
  READER
}

  type User {
    id: ID!
    email: String!
    name: String!
    role: Role!
    posts: [Post!]!
    comments: [Comment!]!
    likes: [Like!]!
    createdAt: String!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    published: Boolean!
    author: User!
    authorId: String!
    comments: [Comment!]!
    tags: [Tag!]!
    likes: [Like!]!
    createdAt: String!
    updatedAt: String!
  }

  type Comment {
    id: ID!
    body: String!
    post: Post!
    postId: String!
    author: User!
    authorId: String!
    createdAt: String!
  }

  type Tag {
    id: ID!
    name: String!
    posts: [Post!]!
    createdAt: String!
  }

  type Like {
    id: ID!
    user: User!
    userId: String!
    post: Post!
    postId: String!
    createdAt: String!
  }

  input UserCreateInput {
    email: String!
    name: String!
    role: Role
  }

  input PostCreateInput {
    title: String!
    content: String!
    published: Boolean
    authorId: String!
  }

  input CommentCreateInput {
    body: String!
    postId: String!
    authorId: String!
  }

  input TagCreateInput {
    name: String!
  }

  input LikeCreateInput {
    userId: String!
    postId: String!
  }

  input UserUpdateInput {
    email: String
    name: String
    role: Role
  }

  input PostUpdateInput {
    title: String
    content: String
    published: Boolean
    authorId: String
  }

  input CommentUpdateInput {
    body: String
    postId: String
    authorId: String
  }

  input TagUpdateInput {
    name: String
  }

  input LikeUpdateInput {
    userId: String
    postId: String
  }

  type Query {
    user(id: ID!): User
    users: [User!]!
    usersCount: Int!
    post(id: ID!): Post
    postsCount: Int!
    comment(id: ID!): Comment
    comments: [Comment!]!
    commentsCount: Int!
    tag(id: ID!): Tag
    tags: [Tag!]!
    tagsCount: Int!
    like(id: ID!): Like
    likes: [Like!]!
    likesCount: Int!
  }

  type Mutation {
    createUser(input: UserCreateInput!): User!
    updateUser(id: ID!, input: UserUpdateInput!): User!
    deleteUser(id: ID!): User!
    updatePost(id: ID!, input: PostUpdateInput!): Post!
    createComment(input: CommentCreateInput!): Comment!
    updateComment(id: ID!, input: CommentUpdateInput!): Comment!
    deleteComment(id: ID!): Comment!
    createTag(input: TagCreateInput!): Tag!
    updateTag(id: ID!, input: TagUpdateInput!): Tag!
    deleteTag(id: ID!): Tag!
    createLike(input: LikeCreateInput!): Like!
    updateLike(id: ID!, input: LikeUpdateInput!): Like!
    deleteLike(id: ID!): Like!
  }

`
