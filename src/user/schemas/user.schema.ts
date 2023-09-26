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
  profile_uri: string;

  @Prop({ required: false })
  lenguage_preference: string;

  @Prop({ required: false })
  birth_date: Date;

  @Prop()
  journal_entries?: JournalEntry[];

  @Prop()
  music_genres: string[];

  @Prop()
  achievements?: Achievements[];
}

export const UserSchema = SchemaFactory.createForClass(User);
