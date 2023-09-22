class AchievementsDto {
  name: string;
}

export class CreateUserDto {
  name: string;
  email: string;
  profileUri: string;
  pronouns: string[];
  lenguagePreference: string;
  birthDate: Date;
  musicGenres?: string[];
  achievements: AchievementsDto[];
}
