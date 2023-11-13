import { ObjectId } from 'mongoose';

export class CreateJournalDto {
  _id?: string | ObjectId;
  userEmail: string;
  title: string;
  description: string;
  emotion: string;
  question?: string;
  response?: string;
  reminded?: boolean;
}
