import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export async function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}