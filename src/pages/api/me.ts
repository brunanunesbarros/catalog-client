import type { NextApiRequest, NextApiResponse } from 'next'
import { query as q } from 'faunadb'
import { fauna } from '../../services/fauna'
import { User } from '../../types/user';
import { ResponseAuth } from '../../types/response-auth';
import decryptJwt from './decryptJwt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseAuth | { message: string}>
) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(401)
      .json({ message: 'Token not present.' })
  }

  const [, token] = authorization?.split(' ');

  if (!token) {
    return res 
      .status(401)
      .json({ message: 'Token not present.' })
  }

  const email = decryptJwt(token);

  if (email === null) {
    res.status(401).json({message: 'Token bad formatted'})
  }

  let user: {data: User, ref: any} = {} as any;

  try {
    user = await fauna.query(
      q.Let(
        {
          doc: q.Get(q.Match(q.Index("users_by_email"), email as string)),
        },
        {
          ref: q.Select(["ref", "id"], q.Var("doc")),
          data: q.Select(["data"], q.Var("doc"))
        }
      )
    )
  } catch(err) {
    console.log(err);
    res.status(500).json({message: "Something wrong happens here! Sorry :("});
  }
  
  if(!user) {
    res.status(401).json({ message: "User not found."})
  } 

  res.status(200).json({
    id: user.ref,
    name: user.data.name,
    email: user.data.email,
    avatar: user.data.avatar,
    token
  } as ResponseAuth);

}
