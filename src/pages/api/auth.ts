import type { NextApiRequest, NextApiResponse } from 'next'
import { query as q } from 'faunadb'
import { fauna } from '../../services/fauna'
import { User } from '../../types/user';
import generateJwt from './generateJwt';
import { ResponseAuth } from '../../types/response-auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseAuth | { message: string}>
) {
  const { email, password } = req.body;
  let user: {data: User, ref: any} = {} as any;

  try {
    // user = await fauna.query(
    // q.Get(
    //   q.Match(q.Index('users_by_email'), email)
    // )
    // );
    user = await fauna.query(
      q.Let(
        {
          doc: q.Get(q.Match(q.Index("users_by_email"), email)),
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

  if (password !== user.data.password) {
    res.status(401).json({ message: "Wrong password."})
  } 

  const { token } = generateJwt(email, {
    permissions: user.data.permissions,
    roles: user.data.roles,
  })

  res.status(200).json({
    id: user.ref,
    name: user.data.name,
    email: user.data.email,
    avatar: user.data.avatar,
    token
  } as ResponseAuth)

}
