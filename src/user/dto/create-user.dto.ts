class AchievementsDto {
  name: string;
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
