import * as jsonwebtoken from 'jsonwebtoken';
import config from '@local/config';

type ValidateResponse = {
  id: String;
  warriorname: String;
  iat: number;
  exp: number;
}

export const validateToken = (token: string): ValidateResponse => {
  return jsonwebtoken.verify(token, config.jwtSecret) as ValidateResponse;
};
