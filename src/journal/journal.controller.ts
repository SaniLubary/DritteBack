import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JournalFeedbackReturn, JournalService } from './journal.service';
import { Journal } from './schemas/journal.schema';
import { CreateJournalDto } from './dto/create-journal.dto';
import { EmailMatchesUserGuard } from 'src/email-matches-user/email-matches-user.guard';

@Controller('journal')
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Get(':email')
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
  createJournal(@Body() journal: CreateJournalDto): boolean {
    try {
      this.journalService.createJournal(journal);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
