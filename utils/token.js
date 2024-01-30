import jwt from 'jsonwebtoken'

export const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN, {expiresIn: '30m'})
 }

export const createAccessToken = (payload) => {
   return jwt.sign(payload, process.env.ACCESS_TOKEN, {expiresIn: '60m'})
}

export const createRefreshToken = (payload) => {
   return jwt.sign(payload, process.env.REFRESH_TOKEN, {expiresIn: '7d'})
}