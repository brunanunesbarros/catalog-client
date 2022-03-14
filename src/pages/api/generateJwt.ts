import jwt from 'jsonwebtoken'

export default function generateJwt(email: string, payload: object = {}) {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    subject: email,
    expiresIn: '1d', // 1 dia
  })

  return {
    token
  }
}