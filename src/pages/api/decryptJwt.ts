import jwt from 'jsonwebtoken'

export default function decryptJwt(token: string): { result: string | null, message: string, success: boolean } {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { sub: string };

    return {
      result: decoded.sub,
      message: '', 
      success: true
    };
  } catch (err: any) {
    console.log(err.message);

    return {
      result: null,
      message: err.message,
      success: false
    };
  }

}