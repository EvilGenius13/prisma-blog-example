import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { id } = req.query;

    if (id) {
      // Handle GET request to fetch a tag by ID
      const tag = await prisma.tag.findUnique({
        where: { id: String(id) },
        include: { posts: true },
      });

      if (tag) {
        res.status(200).json(tag);
      } else {
        res.status(404).json({ message: 'Tag not found' });
      }
    } else {
      // Handle GET request to fetch all tags
      const tags = await prisma.tag.findMany({ include: { posts: true } });
      res.status(200).json(tags);
    }
  } else if (req.method === 'POST') {
    // Handle POST request to create a new tag
    const { name } = req.body;
    const tag = await prisma.tag.create({ data: { name } });
    res.status(201).json(tag);
  } else if (req.method === 'PUT') {
    // Handle PUT request to update a tag
    const { id, name } = req.body;
    const updatedTag = await prisma.tag.update({
      where: { id: String(id) },
      data: { name },
    });
    res.status(200).json(updatedTag);
  } else if (req.method === 'DELETE') {
    // Handle DELETE request to delete a tag
    const { id } = req.query;
    await prisma.tag.delete({ where: { id: String(id) } });
    res.status(204).end();
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}