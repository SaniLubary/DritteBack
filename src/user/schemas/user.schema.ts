import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';
import { UserAchievement, UserAchievementSchema } from './achievements.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  _id: ObjectId;

  @Prop({ required: false })
  name: string;

  @Prop({ type: [String], required: true })
  deviceTokens: string[];

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  profileUri: string;

  @Prop({ required: false })
  lenguagePreference: string;

  @Prop({ required: false })
  birthDate: Date;

  @Prop({ required: false })
  musicGenres: string[];

  @Prop({
    required: true,
    default: [],
    type: [UserAchievementSchema],
  })
  achievements: UserAchievement[];
}

export const UserSchema = SchemaFactory.createForClass(User);
