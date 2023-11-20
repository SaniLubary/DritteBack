import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';

@Controller('achievements')
@UseGuards(AuthGuard)
@UseFilters(HttpExceptionFilter)
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Get()
  getAchievements(@Param('email') email: string) {
    return this.achievementService.getAchievements(email);
  }

  @Post('notify')
  setNotified(
    @Body() body: { achievementId: string },
    @Param('email') email: string,
  ) {
    return this.achievementService.setAchievementNotifed(
      body.achievementId,
      email,
    );
  }
}
