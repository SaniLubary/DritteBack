import { JournalEntry } from '../schemas/journal-entry.schema';

class AchievementsDto {
  name: string;
}

export class CreateUserDto {
  name: string;
  email: string;
  profileUri: string;
  lenguagePreference: string;
  birthDate: Date;
  musicGenres?: string[];
  journalEntries?: JournalEntry[];
  achievements: AchievementsDto[];
}
