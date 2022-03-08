import jwt from 'jsonwebtoken'

export default function decryptJwt(token: string): string | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { sub: string };

    return decoded.sub;
  } catch (err) {
    console.log(err);
    return null;
  }

}