import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type JournalEntryDocument = HydratedDocument<JournalEntry>;

@Schema({ timestamps: true })
export class JournalEntry {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  emotion: string;
}

export const JournalEntrySchema = SchemaFactory.createForClass(JournalEntry);
