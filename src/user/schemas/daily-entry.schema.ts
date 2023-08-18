import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DailyEntryDocument = HydratedDocument<DailyEntry>;

@Schema({ timestamps: true })
export class DailyEntry {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;
}

export const DailyEntrySchema = SchemaFactory.createForClass(DailyEntry);
