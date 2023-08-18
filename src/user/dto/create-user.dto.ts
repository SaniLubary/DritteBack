class DailyActivitiesDto {
  emotions: { name: string }[];
  daily_entry: { title: string; description: string };
}
class AchievementsDto {
  name: string;
}

export class CreateUserDto {
  name: string;
  mail: string;
  points: number;
  daily_activities: DailyActivitiesDto[];
  achievements: AchievementsDto[];
}
