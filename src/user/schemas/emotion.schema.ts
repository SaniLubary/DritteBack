import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EmotionsDocument = HydratedDocument<Emotions>;

@Schema({ timestamps: true })
export class Emotions {
  @Prop({ required: true })
  name: string;
}

export const EmotionsSchema = SchemaFactory.createForClass(Emotions);
