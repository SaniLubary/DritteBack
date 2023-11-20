import { Injectable } from '@nestjs/common';
import { Achievement, AchievementDocument } from './schemas/achievement.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { JournalService } from 'src/journal/journal.service';
import { UserService } from 'src/user/user.service';

export type EmotionsTypes = 'angry' | 'sad' | 'neutral' | 'happy' | 'love';
const emotions: EmotionsTypes[] = ['angry', 'sad', 'neutral', 'happy', 'love'];

@Injectable()
export class AchievementService {
  constructor(
    @InjectModel(Achievement.name)
    private achievementModel: Model<AchievementDocument>,
    private readonly journalService: JournalService,
    private readonly userService: UserService,
  ) {}

  async getAchievements(email: string): Promise<Achievement[]> {
    const user = await this.userService.findOne(email);
    const alreadyWonAchievements = user.achievements
      ? user.achievements.map((achievement) => achievement.achievementId)
      : [];

    // logic for totalJournalsAchievement
    const totalJournalsObjects = await this.journalService.findAll(email);
    const totalJournals = totalJournalsObjects.length;
    const totalJournalsAchievements = await this.getTotalJournalsAchievements(
      totalJournals,
      alreadyWonAchievements,
    );

    // logic for total emotions achievements
    let totalEmotionJournalsAchievements = [];
    for (const emotion of emotions) {
      const totalEmotionJournals = totalJournalsObjects.filter(
        (journal) => journal.emotion === emotion,
      ).length;

      if (totalEmotionJournals > 0) {
        const totalEmotionAchievements =
          await this.getTotalEmotionJournalsAchievements(
            totalEmotionJournals,
            alreadyWonAchievements,
            emotion,
          );
        if (totalEmotionAchievements.length > 0) {
          totalEmotionJournalsAchievements = [
            ...totalEmotionJournalsAchievements,
            ...totalEmotionAchievements,
          ];
        }
      }
    }

    // getting it all together
    user.achievements = [
      ...user.achievements,
      ...totalJournalsAchievements.map((achievements) => ({
        achievementId: achievements._id,
        notified: false,
        dateWon: new Date(),
      })),
      ...totalEmotionJournalsAchievements.map((achievements) => ({
        achievementId: achievements._id,
        notified: false,
        dateWon: new Date(),
      })),
    ];

    await this.userService.update(user.email, user);

    // Return not notified achievements of the user
    const achievements = [];
    for (let i = 0; i < user.achievements.length; i++) {
      const achievement = user.achievements[i];
      if (!achievement.notified) {
        achievements.push(
          await this.getAchievementById(achievement.achievementId),
        );
      }
    }

    return achievements;
  }

  async getAchievementById(_id: ObjectId): Promise<Achievement> {
    return this.achievementModel.findOne({ _id }).exec();
  }

  async setAchievementNotifed(
    achievementId: string,
    email: string,
  ): Promise<boolean> {
    const user = await this.userService.findOne(email);

    user.achievements = user.achievements.map((achievement) =>
      achievement.achievementId &&
      achievement.achievementId.toString() == achievementId
        ? { ...achievement, notified: true }
        : achievement,
    );

    return !this.userService.update(user.email, user);
  }

  getTotalJournalsAchievements(
    totalJournals: number,
    alreadyWonAchievementsIds: ObjectId[],
  ): Promise<Achievement[]> {
    return this.achievementModel.aggregate([
      {
        $match: {
          'criteria.totalJournals': { $lte: totalJournals },
        },
      },
      ...alreadyWonAchievementsIds.map((id) => ({
        $match: {
          _id: { $ne: id },
        },
      })),
    ]);
  }

  getTotalEmotionJournalsAchievements(
    totalJournals: number,
    alreadyWonAchievementsIds: ObjectId[],
    emotion: string,
  ): Promise<Achievement[]> {
    return this.achievementModel.aggregate([
      {
        $match: {
          'criteria.emotions.type': emotion,
          'criteria.emotions.total': { $lte: totalJournals },
        },
      },
      ...alreadyWonAchievementsIds.map((id) => ({
        $match: {
          _id: { $ne: id },
        },
      })),
    ]);
  }
}
