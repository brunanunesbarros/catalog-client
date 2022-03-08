import jwt from 'jsonwebtoken'

export default function generateJwt(email: string, payload: object = {}) {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    subject: email,
    expiresIn: 60 * 15, // 15 minutos
  })

  return {
    token
  }
}