import { Request } from 'express';

export interface RequestWithEmailModel extends Request {
  userEmail: string;
}
