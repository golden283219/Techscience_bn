import { sign, verify } from "jsonwebtoken";

export const makeToken = ({ payload, expiresIn }) => {
  const token = sign(payload, process.env.APP_KEY, !!expiresIn ? { expiresIn } : null)
  return token
}

export const verifyToken = req => {
  const parts = req.headers.authorization ? req.headers.authorization.split(' ') : [''];
  let token = parts.length === 2 && parts[0].toLowerCase() === 'bearer' ? parts[1] : undefined;
  let user = undefined

  if(!!token) {
    try {
      user = verify(token, process.env.APP_KEY)
    } catch (err) {
      user = undefined
    }
  }

  return user;
}

export const verifyResetToken = resetToken => {
  let userEmail = undefined

  if(!resetToken) 
    return userEmail

  try {
    const { email } = verify(resetToken, process.env.APP_KEY)
    userEmail = email
  } catch (err) {
    userEmail = undefined
  }

  return userEmail
}