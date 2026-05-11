// Custom resolvers — hand-written by agents.
// Wire to service functions in @mock/db. Default CRUD resolvers are auto-generated.

import {
  registerUser,
  createNewPost,
  publishPost,
  removePost,
  addComment,
  getUserFeed,
  addTagToPost,
  removeTagFromPost,
  findPostsByTag,
} from '@mock/db'
import type { GraphQLContext } from '../../context.js'

export const customResolvers = {
  Query: {
    posts: (_: unknown, args: { published?: boolean }) =>
      getUserFeed({ published: args.published }),

    postsByTag: (_: unknown, args: { name: string }) =>
      findPostsByTag(args.name),
  },
  Mutation: {
    register: (_: unknown, args: { email: string; name: string; role?: string }) =>
      registerUser({ email: args.email, name: args.name, role: args.role as never }),

    createPost: (_: unknown, args: { title: string; content: string }, ctx: GraphQLContext) =>
      createNewPost(ctx.currentUserId, { title: args.title, content: args.content }),

    publishPost: (_: unknown, args: { id: string }, ctx: GraphQLContext) =>
      publishPost(args.id, ctx.currentUserId),

    deletePost: (_: unknown, args: { id: string }, ctx: GraphQLContext) =>
      removePost(args.id, ctx.currentUserId),

    addComment: (_: unknown, args: { postId: string; body: string }, ctx: GraphQLContext) =>
      addComment(args.postId, ctx.currentUserId, args.body),

    addTagToPost: (
      _: unknown,
      args: { postId: string; tagName: string },
      ctx: GraphQLContext
    ) => addTagToPost(args.postId, args.tagName, ctx.currentUserId),

    removeTagFromPost: (
      _: unknown,
      args: { postId: string; tagName: string },
      ctx: GraphQLContext
    ) => removeTagFromPost(args.postId, args.tagName, ctx.currentUserId),
  },
}
