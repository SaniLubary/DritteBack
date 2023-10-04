import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Achievements } from './achievements.schema';
import { JournalEntry } from './journal-entry.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: false })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  profileUri: string;

  @Prop({ required: false })
  lenguagePreference: string;

  @Prop({ required: false })
  birthDate: Date;

  @Prop()
  journalEntries?: JournalEntry[];

  @Prop()
  musicGenres: string[];

  @Prop()
  achievements?: Achievements[];
}

export const UserSchema = SchemaFactory.createForClass(User);
