import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query, tagNames, authorId } = req.query;

  if (req.method === 'GET') {
    if (query) {
      // Handle search query
      const posts = await prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: String(query) } },
            { body: { contains: String(query) } },
          ],
          authorId: authorId ? String(authorId) : undefined,
          tags: tagNames
            ? {
                some: {
                  name: { in: String(tagNames).split(",") },
                },
              }
            : undefined,
        },
        include: { author: true, tags: true },
      });
      res.status(200).json(posts);
    } else {
      res.status(400).json({ message: 'Query parameter is required' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
