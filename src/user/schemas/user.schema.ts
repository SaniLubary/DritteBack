import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { Achievements } from './achievements.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: false, type: mongoose.Types.ObjectId })
  _id: ObjectId;

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
  musicGenres: string[];

  @Prop()
  achievements?: Achievements[];
}

export const UserSchema = SchemaFactory.createForClass(User);
