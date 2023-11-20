import { ObjectId } from 'mongoose';

class AchievementsDto {
  achievementId: ObjectId;
  notified: boolean;
  dateWon: Date;
}

export class CreateUserDto {
  name: string;
  email: string;
  deviceTokens: string[];
  profileUri: string;
  lenguagePreference: string;
  birthDate: Date;
  musicGenres?: string[];
  achievements: AchievementsDto[];
}
