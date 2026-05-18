// Auto-generated — DO NOT EDIT
import { prisma } from '@mock/db'

function transformUserInput(input: Record<string, unknown>): Record<string, unknown> {
  return input
}

function transformPostInput(input: Record<string, unknown>): Record<string, unknown> {
  const rest: Record<string, unknown> = { ...input }
  const out: Record<string, unknown> = { ...input }
  if (typeof rest.authorId === 'string') { (out as Record<string, unknown>).author = { connect: { id: rest.authorId } }; delete (out as Record<string, unknown>).authorId }
  return out
}

function transformCommentInput(input: Record<string, unknown>): Record<string, unknown> {
  const rest: Record<string, unknown> = { ...input }
  const out: Record<string, unknown> = { ...input }
  if (typeof rest.postId === 'string') { (out as Record<string, unknown>).post = { connect: { id: rest.postId } }; delete (out as Record<string, unknown>).postId }
  if (typeof rest.authorId === 'string') { (out as Record<string, unknown>).author = { connect: { id: rest.authorId } }; delete (out as Record<string, unknown>).authorId }
  return out
}

function transformTagInput(input: Record<string, unknown>): Record<string, unknown> {
  return input
}

function transformLikeInput(input: Record<string, unknown>): Record<string, unknown> {
  const rest: Record<string, unknown> = { ...input }
  const out: Record<string, unknown> = { ...input }
  if (typeof rest.userId === 'string') { (out as Record<string, unknown>).user = { connect: { id: rest.userId } }; delete (out as Record<string, unknown>).userId }
  if (typeof rest.postId === 'string') { (out as Record<string, unknown>).post = { connect: { id: rest.postId } }; delete (out as Record<string, unknown>).postId }
  return out
}

export const generatedResolvers = {
  Query: {
    user: (_: unknown, args: { id: string }) =>
      prisma.user.findUnique({ where: { id: args.id } }),
    users: () =>
      prisma.user.findMany({ orderBy: { createdAt: 'desc' } }),
    usersCount: () =>
      prisma.user.count(),
    post: (_: unknown, args: { id: string }) =>
      prisma.post.findUnique({ where: { id: args.id } }),
    postsCount: () =>
      prisma.post.count(),
    comment: (_: unknown, args: { id: string }) =>
      prisma.comment.findUnique({ where: { id: args.id } }),
    comments: () =>
      prisma.comment.findMany({ orderBy: { createdAt: 'desc' } }),
    commentsCount: () =>
      prisma.comment.count(),
    tag: (_: unknown, args: { id: string }) =>
      prisma.tag.findUnique({ where: { id: args.id } }),
    tags: () =>
      prisma.tag.findMany({ orderBy: { createdAt: 'desc' } }),
    tagsCount: () =>
      prisma.tag.count(),
    like: (_: unknown, args: { id: string }) =>
      prisma.like.findUnique({ where: { id: args.id } }),
    likes: () =>
      prisma.like.findMany({ orderBy: { createdAt: 'desc' } }),
    likesCount: () =>
      prisma.like.count(),
  },
  Mutation: {
    createUser: (_: unknown, args: { input: Record<string, unknown> }) =>
      prisma.user.create({ data: transformUserInput(args.input) as never }),
    updateUser: (_: unknown, args: { id: string; input: Record<string, unknown> }) =>
      prisma.user.update({ where: { id: args.id }, data: transformUserInput(args.input) as never }),
    deleteUser: (_: unknown, args: { id: string }) =>
      prisma.user.delete({ where: { id: args.id } }),
    updatePost: (_: unknown, args: { id: string; input: Record<string, unknown> }) =>
      prisma.post.update({ where: { id: args.id }, data: transformPostInput(args.input) as never }),
    createComment: (_: unknown, args: { input: Record<string, unknown> }) =>
      prisma.comment.create({ data: transformCommentInput(args.input) as never }),
    updateComment: (_: unknown, args: { id: string; input: Record<string, unknown> }) =>
      prisma.comment.update({ where: { id: args.id }, data: transformCommentInput(args.input) as never }),
    deleteComment: (_: unknown, args: { id: string }) =>
      prisma.comment.delete({ where: { id: args.id } }),
    createTag: (_: unknown, args: { input: Record<string, unknown> }) =>
      prisma.tag.create({ data: transformTagInput(args.input) as never }),
    updateTag: (_: unknown, args: { id: string; input: Record<string, unknown> }) =>
      prisma.tag.update({ where: { id: args.id }, data: transformTagInput(args.input) as never }),
    deleteTag: (_: unknown, args: { id: string }) =>
      prisma.tag.delete({ where: { id: args.id } }),
    createLike: (_: unknown, args: { input: Record<string, unknown> }) =>
      prisma.like.create({ data: transformLikeInput(args.input) as never }),
    updateLike: (_: unknown, args: { id: string; input: Record<string, unknown> }) =>
      prisma.like.update({ where: { id: args.id }, data: transformLikeInput(args.input) as never }),
    deleteLike: (_: unknown, args: { id: string }) =>
      prisma.like.delete({ where: { id: args.id } }),
  },
  User: {
    posts: (parent: { id: string }) =>
      prisma.user.findUnique({ where: { id: parent.id } }).posts(),
    comments: (parent: { id: string }) =>
      prisma.user.findUnique({ where: { id: parent.id } }).comments(),
    likes: (parent: { id: string }) =>
      prisma.user.findUnique({ where: { id: parent.id } }).likes(),
  },
  Post: {
    author: (parent: { id: string }) =>
      prisma.post.findUnique({ where: { id: parent.id } }).author(),
    comments: (parent: { id: string }) =>
      prisma.post.findUnique({ where: { id: parent.id } }).comments(),
    tags: (parent: { id: string }) =>
      prisma.post.findUnique({ where: { id: parent.id } }).tags(),
    likes: (parent: { id: string }) =>
      prisma.post.findUnique({ where: { id: parent.id } }).likes(),
  },
  Comment: {
    post: (parent: { id: string }) =>
      prisma.comment.findUnique({ where: { id: parent.id } }).post(),
    author: (parent: { id: string }) =>
      prisma.comment.findUnique({ where: { id: parent.id } }).author(),
  },
  Tag: {
    posts: (parent: { id: string }) =>
      prisma.tag.findUnique({ where: { id: parent.id } }).posts(),
  },
  Like: {
    user: (parent: { id: string }) =>
      prisma.like.findUnique({ where: { id: parent.id } }).user(),
    post: (parent: { id: string }) =>
      prisma.like.findUnique({ where: { id: parent.id } }).post(),
  },

}
