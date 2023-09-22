import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Achievements } from './achievements.schema';
import { JournalEntry } from './journal-entry.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  profileUri: string;

  @Prop({ required: true })
  pronouns: string[];

  @Prop({ required: true })
  lenguagePreference: string;

  @Prop({ required: true })
  birthDate: string;

  @Prop()
  journal_entries: JournalEntry[];

  @Prop()
  music_genres: string[];

  @Prop()
  achievements: Achievements[];
}

export const UserSchema = SchemaFactory.createForClass(User);
