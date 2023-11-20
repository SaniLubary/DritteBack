import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type UserAchievementDocument = HydratedDocument<UserAchievement>;

@Schema({ timestamps: true })
export class UserAchievement {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  achievementId: ObjectId;

  @Prop({ required: true, type: Boolean })
  notified: boolean;

  @Prop({ required: true, type: Date })
  dateWon: Date;
}

export const UserAchievementSchema =
  SchemaFactory.createForClass(UserAchievement);
