import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EmotionsDocument = HydratedDocument<Emotions>;

@Schema({ timestamps: false })
export class Emotions {
  @Prop({ type: String, required: true })
  type: string;

  @Prop({ default: 0, type: Number, required: false })
  total: number;

  @Prop({ default: 0, type: Number, required: false })
  week: number;

  @Prop({ default: 0, type: Number, required: false })
  day: number;
}

export const EmotionsSchema = SchemaFactory.createForClass(Emotions);

export type CriteriaDocument = HydratedDocument<Criteria>;

@Schema({ timestamps: false })
export class Criteria {
  @Prop({ type: [EmotionsSchema], required: false })
  emotions: Emotions[];

  @Prop({ default: 0, type: Number, required: false })
  totalJournals: number;

  @Prop({ default: 0, type: Number, required: false })
  perWeekJournals: number;

  @Prop({ default: 0, type: Number, required: false })
  perDayJournals: number;

  @Prop({ default: 0, type: Number, required: false })
  totalAnsweredQuestions: number;
}

export const CriteriaSchema = SchemaFactory.createForClass(Criteria);
