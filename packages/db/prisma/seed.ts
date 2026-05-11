import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const admin = await prisma.user.create({
    data: { email: 'admin@example.com', name: 'Admin User', role: 'ADMIN' },
  })
  const author = await prisma.user.create({
    data: { email: 'author@example.com', name: 'Jane Author', role: 'AUTHOR' },
  })
  const reader = await prisma.user.create({
    data: { email: 'reader@example.com', name: 'Bob Reader', role: 'READER' },
  })

  // Create posts
  const post1 = await prisma.post.create({
    data: {
      title: 'Getting Started with Prisma',
      content: 'Prisma is a next-generation ORM for Node.js and TypeScript...',
      published: true,
      authorId: author.id,
    },
  })
  const post2 = await prisma.post.create({
    data: {
      title: 'GraphQL Best Practices',
      content: 'When designing a GraphQL API, consider these patterns...',
      published: true,
      authorId: author.id,
    },
  })
  const post3 = await prisma.post.create({
    data: {
      title: 'Draft: Advanced TypeScript',
      content: 'This post is still in progress...',
      published: false,
      authorId: admin.id,
    },
  })

  // Create comments
  await prisma.comment.createMany({
    data: [
      { body: 'Great introduction!', postId: post1.id, authorId: reader.id },
      { body: 'Very helpful, thanks!', postId: post1.id, authorId: admin.id },
      { body: 'I learned a lot from this.', postId: post2.id, authorId: reader.id },
    ],
  })

  console.log('Seeded: 3 users, 3 posts, 3 comments')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
