import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { JournalFeedbackReturn, JournalService } from './journal.service';
import { Journal } from './schemas/journal.schema';
import { CreateJournalDto } from './dto/create-journal.dto';
import { EmailMatchesUserGuard } from 'src/email-matches-user/email-matches-user.guard';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';

@Controller('journal')
@UseFilters(HttpExceptionFilter)
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Get('/:id')
  async find(@Param('id') id: string): Promise<Journal> {
    console.log('Finding journal with id', id);
    return await this.journalService.findById(id);
  }

  @Get('/all/:email')
  @UseGuards(EmailMatchesUserGuard)
  async findAll(@Param('email') email: string): Promise<Journal[]> {
    return await this.journalService.findAll(email);
  }

  @Post('/feedback')
  async getJournalEmotionFeedback(
    @Body() body: { description: string },
  ): Promise<JournalFeedbackReturn> {
    return await this.journalService.getJournalFeedback(body.description);
  }

  @Post()
  async createJournal(@Body() journal: CreateJournalDto): Promise<Journal> {
    const newJournal = await this.journalService.upsertJournal(journal);
    console.log('New Journal: ', newJournal);
    return newJournal;
  }
}
