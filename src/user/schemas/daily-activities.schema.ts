import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Emotions } from './emotion.schema';
import { DailyEntry } from './daily-entry.schema';

export type DailyActivitiesDocument = HydratedDocument<DailyActivities>;

@Schema({ timestamps: true })
export class DailyActivities {
  @Prop([{ required: true, type: Emotions }])
  emotions: Emotions[];

  @Prop({ required: true, type: DailyEntry })
  daily_entry: DailyEntry;
}

export const DailyActivitiesSchema =
  SchemaFactory.createForClass(DailyActivities);
