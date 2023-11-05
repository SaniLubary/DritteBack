import { Injectable } from '@nestjs/common';
import { Journal, JournalDocument } from './schemas/journal.schema';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { CreateJournalDto } from './dto/create-journal.dto';
import { InjectModel } from '@nestjs/mongoose';
import { EncryptionService } from 'src/encryption/encryption.service';
import axios from 'axios';

export type JournalFeedbackReturn = {
  emotion: string;
};

@Injectable()
export class JournalService {
  constructor(
    private readonly userService: UserService,
    @InjectModel(Journal.name) private journalModel: Model<JournalDocument>,
    private readonly encryptionService: EncryptionService,
  ) {}

  emotionMapper(emotion) {
    if (emotion < -0.5) {
      return 'angry';
    }
    if (emotion < -0.25) {
      return 'sad';
    }
    if (emotion < 0.25) {
      return 'neutral';
    }
    if (emotion < 0.5) {
      return 'happy';
    }
    if (emotion < 1) {
      return 'love';
    }
  }

  async getJournalFeedback(
    description: string,
  ): Promise<JournalFeedbackReturn> {
    return await axios
      .post('http://localhost:5001/feedback', { text: description })
      .then((response) => {
        console.log('Response:', response.data);
        return { emotion: this.emotionMapper(response.data.emotion) };
      })
      .catch((error) => {
        console.error('Error:', error);
        return { emotion: 'neutral' };
      });
  }

  async findAll(email: string): Promise<Journal[]> {
    return await this.userService
      .findOne(email)
      .then(async (user) => {
        return await this.journalModel
          .find({ userId: user._id })
          .exec()
          .then((journals): Journal[] => {
            console.log('journals before decrypt', journals);
            const decryptedJournals = journals.map(
              (journal: Journal): Journal => ({
                _id: journal._id,
                userId: journal.userId,
                title: this.encryptionService.decrypt(journal.title),
                description: this.encryptionService.decrypt(
                  journal.description,
                ),
                emotion: this.encryptionService.decrypt(journal.emotion),
                createdAt: journal.createdAt,
              }),
            );
            console.log('journals', decryptedJournals);
            return decryptedJournals;
          })
          .catch((error) => {
            console.log('Error finding or decrypting Journals', error);
            return [];
          });
      })
      .catch((error) => {
        console.log('Error finding user to get Journals', error);
        return [];
      });
  }

  createJournal(journal: CreateJournalDto): void {
    try {
      this.userService.findOne(journal.userEmail).then((user) => {
        delete journal.userEmail;
        this.journalModel
          .create({
            ...journal,
            userId: user._id,
            title: this.encryptionService.encrypt(journal.title),
            description: this.encryptionService.encrypt(journal.description),
            emotion: this.encryptionService.encrypt(journal.emotion),
          })
          .then((journal) => console.log('Journal created', journal));
      });
    } catch (error) {
      console.log('Error creating journal', error);
    }
  }
}
