import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { id } = req.query;

    if (id) {
      // Handle GET request to fetch an author by ID
      const author = await prisma.author.findUnique({
        where: { id: String(id) },
      });

      if (author) {
        res.status(200).json(author);
      } else {
        res.status(404).json({ message: 'Author not found' });
      }
    } else {
      // Handle GET request to fetch all authors
      const authors = await prisma.author.findMany();
      res.status(200).json(authors);
    }
  } else if (req.method === 'POST') {
    // Handle POST request to create a new author
    const { username, givenName, familyName } = req.body;
    const author = await prisma.author.create({
      data: { username, givenName, familyName },
    });
    res.status(201).json(author);
  } else if (req.method === 'PUT') {
    // Handle PUT request to update an author
    const { id, username, givenName, familyName } = req.body;
    const updatedAuthor = await prisma.author.update({
      where: { id: String(id) },
      data: { username, givenName, familyName },
    });
    res.status(200).json(updatedAuthor);
  } else if (req.method === 'DELETE') {
    // Handle DELETE request to delete an author
    const { id } = req.query;
    console.log(req.query.id)
    await prisma.author.delete({
      where: { id: String(id) },
    });
    res.status(204).end();
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}