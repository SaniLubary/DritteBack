import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type JournalDocument = HydratedDocument<Journal>;

@Schema({ timestamps: true })
export class Journal {
  _id: ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  emotion: string;

  @Prop({ required: false })
  question: string;

  @Prop({ required: false })
  response: string;

  @Prop({ required: false })
  reminded: boolean;

  @Prop({ required: false })
  createdAt: Date;
}

export const JournalSchema = SchemaFactory.createForClass(Journal);
