import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from 'faunadb'
import decryptJwt from "./decryptJwt";

export default async function deleteProduct( 
  req: NextApiRequest,
  res: NextApiResponse) {
    
  const id = req.body
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

  let product = {} as any;
  
  try {
    product = await fauna.query(
      q.Delete(q.Ref(q.Collection('products'), id))
    )
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Algo deu errado ao deletar o produto.' })
  }
  
  res.status(200).json({ message: 'Deu tudo certo!' })
}