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
  res: NextApiResponse<Product[]>
) {
  const products: { data: any[] } = await fauna.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection('products')), { size: 10 }),
      q.Lambda((x) => q.Get(x))
    )
    
  );

  res.status(200).json(products.data)

}
