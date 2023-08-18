import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DailyActivities } from './daily-activities.schema';
import { Achievements } from './achievements.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  mail: string;

  @Prop({ required: true })
  points: number;

  @Prop([
    {
      type: DailyActivities,
      required: true,
    },
  ])
  daily_activities: DailyActivities[];

  @Prop([
    {
      type: Achievements,
    },
  ])
  achievements: Achievements[];
}

export const UserSchema = SchemaFactory.createForClass(User);
