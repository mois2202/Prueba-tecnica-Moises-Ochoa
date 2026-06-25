import { UserDocument } from '../auth/models';

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}
