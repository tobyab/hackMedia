import prisma from '../../utils/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
var Filter = require('bad-words'),
    filter = new Filter();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const messages = await prisma.message.findMany({
      orderBy: {
        created_at: 'desc'
      }
    });

    return res.json(
      messages.map((message) => ({
        id: message.id.toString(),
        body: message.body,
        created_by: message.created_by,
        updated_at: message.created_at
      }))
    );
  }

  const session = await getSession({ req });
  const { email, name } = session.user;

  if (!session) {
    return res.status(403).send("You're not allowed to do this. Try again!");
  }

  if (req.method === 'POST') {
    const newMessage = await prisma.message.create({
      data: {
        email,
        body: filter.clean(req.body.body || '').slice(0, 500),
        created_by: name,
      }
    });

    return res.status(200).json({
      id: newMessage.id.toString(),
      body: newMessage.body,
      created_by: newMessage.created_by,
      created_at: newMessage.created_at
    });
  }

  return res.send("'Erm, you're not allowed to do that.' -Toby Wednesday 6 April 2022 at 18:32pm GMT");
}