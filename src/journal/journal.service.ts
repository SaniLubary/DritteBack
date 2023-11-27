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

  async findByHoursAgoUnreminded(hoursAgo: Date): Promise<Journal[]> {
    return await this.journalModel
      .find({
        createdAt: { $lt: hoursAgo },
        $or: [{ reminded: { $exists: false } }, { reminded: { $eq: false } }],
      })
      .lean()
      .then((journals): Journal[] => {
        const decryptedJournals = journals.map((journal: Journal): Journal => {
          return this.decrypttJournal(journal);
        });
        return decryptedJournals;
      })
      .catch((error) => {
        console.log('Error finding or decrypting Journals', error);
        return [];
      });
  }

  async findByHoursAgo(hoursAgo: Date): Promise<Journal[]> {
    return await this.journalModel
      .find({
        createdAt: { $lt: hoursAgo },
      })
      .lean()
      .then((journals): Journal[] => {
        const decryptedJournals = journals.map((journal: Journal): Journal => {
          return this.decrypttJournal(journal);
        });
        return decryptedJournals;
      })
      .catch((error) => {
        console.log('Error finding or decrypting Journals', error);
        return [];
      });
  }

  private decrypttJournal(journal: Journal): Journal {
    return {
      _id: journal._id,
      userId: journal.userId,
      title: this.encryptionService.decrypt(journal.title),
      description: this.encryptionService.decrypt(journal.description),
      emotion: this.encryptionService.decrypt(journal.emotion),
      question:
        journal.question && this.encryptionService.decrypt(journal.question),
      response:
        journal.response && this.encryptionService.decrypt(journal.response),
      reminded: journal.reminded,
      createdAt: journal.createdAt,
    };
  }

  async findById(id: string): Promise<Journal> {
    return await this.journalModel
      .find({ _id: id })
      .lean()
      .then((journals): Journal => {
        const decryptedJournal = journals.map(
          (journal: Journal): Journal => this.decrypttJournal(journal),
        );
        return decryptedJournal[0];
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
            const decryptedJournals = journals.map(
              (journal: Journal): Journal => {
                return this.decrypttJournal(journal);
              },
            );
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

  private searchByIdOrOtherData(journal, user) {
    return journal._id
      ? { _id: journal._id }
      : {
          userId: user._id,
          title: this.encryptionService.encrypt(journal.title),
          description: this.encryptionService.encrypt(journal.description),
          emotion: this.encryptionService.encrypt(journal.emotion),
        };
  }

  async upsertJournal(journal: CreateJournalDto): Promise<Journal> {
    try {
      return this.userService.findOne(journal.userEmail).then(async (user) => {
        const journalToUpsert = {
          _id: journal._id,
          userId: user._id,
          title: this.encryptionService.encrypt(journal.title),
          description: this.encryptionService.encrypt(journal.description),
          emotion: this.encryptionService.encrypt(journal.emotion),
          question:
            journal.question &&
            this.encryptionService.encrypt(journal.question),
          response:
            journal.response &&
            this.encryptionService.encrypt(journal.response),
          reminded: journal?.reminded,
        };

        if (!journal) {
          throw new Error('No journal sent to save');
        }

        const newJournal = await this.journalModel.findOneAndUpdate(
          this.searchByIdOrOtherData(journalToUpsert, user),
          journalToUpsert,
          { upsert: true, returnDocument: 'after' },
        );
        return newJournal;
      });
    } catch (error) {
      console.log('Error creating journal', error);
    }
  }
}
