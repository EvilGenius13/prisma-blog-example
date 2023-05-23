import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query;

  if (req.method === 'GET') {
    if (username) {
      // Handle fetching an author by username
      const author = await prisma.author.findUnique({
        where: { username: String(username) },
        include: { posts: true },
      });

      if (author) {
        res.status(200).json(author);
      } else {
        res.status(404).json({ message: 'Author not found' });
      }
    } else {
      res.status(400).json({ message: 'Username parameter is required' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
