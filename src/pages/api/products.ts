import type { NextApiRequest, NextApiResponse } from 'next'
import { query as q } from 'faunadb'
import { fauna } from '../../services/fauna'

type Product = {
  name: string;
  id: string;
  description: string;
  price: number;
  image: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product[] | { message: string }>
) {

  const { userid } = req.headers;

  if (!userid) {
    return res
      .status(401)
      .json({ message: 'User not present.' })
  }

  const products: { data: any[] } = await fauna.query(
    q.Map(
      q.Paginate(q.Match(q.Index("products_by_owner"), q.Ref(q.Collection("users"), userid))),
      q.Lambda((x) => q.Get(x))
    )
  );

  res.status(200).json(products.data)

}
