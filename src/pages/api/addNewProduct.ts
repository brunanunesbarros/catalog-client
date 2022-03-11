import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from 'faunadb'
import { User } from "../../types/user";
import decryptJwt from "./decryptJwt";

export default async function addNewProduct( 
  req: NextApiRequest,
  res: NextApiResponse) {
    
  const data = req.body
  const { authorization } = req.headers

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

  const resultDecrypt: { 
    result: string | null, 
    message: string, 
    success: boolean } = decryptJwt(token);

    if (resultDecrypt.success === false || resultDecrypt.result === null) {
      res.status(401).json({ message: resultDecrypt.message});
  }
  const email = resultDecrypt.result;

  let user: {data: User, ref: any} = {} as any;

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

  let product = {} as any;
  
  try {
    product = await fauna.query(
      q.Create(
        q.Collection('products'), {
          data: {
            ...data,
            owner: q.Ref(q.Collection("users"), (user.ref).toString()), 
          }
        }
      )
    )

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Algo deu errado ao salvar o produto.' })
  }
  
  res.status(200).json(user)
}