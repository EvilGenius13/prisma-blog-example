import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { id } = req.query;

    if (id) {
      // Handle GET request to fetch a post by ID
      const post = await prisma.post.findUnique({
        where: { id: String(id) },
        include: { author: true, tags: true },
      });

      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    } else {
      // Handle GET request to fetch all posts
      const posts = await prisma.post.findMany({
        include: { author: true, tags: true },
      });
      res.status(200).json(posts);
    }
  } else if (req.method === 'POST') {
    // Handle POST request to create a new post
    const { title, body, authorId, tagIds } = req.body;
    const post = await prisma.post.create({
      data: {
        title,
        body,
        author: { connect: { id: authorId } },
        tags: { connect: tagIds.map((tagId: string) => ({ id: tagId })) },
      },
      include: { author: true, tags: true },
    });
    res.status(201).json(post);
  } else if (req.method === 'PUT') {
    // Handle PUT request to update a post
    const { id, title, body } = req.body;
    const updatedPost = await prisma.post.update({
      where: { id: String(id) },
      data: { title, body },
      include: { author: true, tags: true },
    });
    res.status(200).json(updatedPost);
  } else if (req.method === 'DELETE') {
    // Handle DELETE request to delete a post
    const { id } = req.query;
    await prisma.post.delete({
      where: { id: String(id) },
    });
    res.status(204).end();
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}