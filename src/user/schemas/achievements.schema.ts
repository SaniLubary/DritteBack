import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AchievementsDocument = HydratedDocument<Achievements>;

@Schema({ timestamps: true })
export class Achievements {
  @Prop({ required: true })
  name: string;
}

export const AchievementsSchema = SchemaFactory.createForClass(Achievements);
