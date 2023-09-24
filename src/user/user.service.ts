import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService implements OnModuleInit {
  private logger = new Logger(UserService.name);
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  onModuleInit() {
    // this._mockAUser();
  }

  _mockAUser() {
    this.create({
      name: 'Santi',
      email: 'santiago.lp.cop@gmail.com',
      achievements: [{ name: 'SuperCool' }],
      birthDate: new Date('2000-01-01'),
      lenguagePreference: 'spanish',
      profileUri:
        'https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_960_720.png',
    });
  }

  async create(user: CreateUserDto): Promise<User> {
    try {
      const newUser: User = {
        birth_date: user.birthDate,
        email: user.email,
        lenguage_preference: user.lenguagePreference,
        music_genres: user.musicGenres,
        name: user.name,
        profile_uri: user.profileUri,
        achievements: user.achievements,
      };

      const createdUser = await this.userModel.create(newUser);
      if (createdUser) {
        this.logger.log(`User ${createdUser} created`);
      } else {
        this.logger.log(`User ${user.name} was not created`);
      }
      return createdUser;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findOne(email: string): Promise<CreateUserDto> {
    try {
      const users: User[] = await this.userModel.find({ email: email }).exec();
      console.log('User found', users);
      const user: CreateUserDto = {
        achievements: users[0].achievements,
        birthDate: users[0].birth_date,
        email: users[0].email,
        lenguagePreference: users[0].lenguage_preference,
        name: users[0].name,
        profileUri: users[0].profile_uri,
        journalEntries: users[0].journal_entries,
        musicGenres: users[0].music_genres,
      };
      return user;
    } catch (error) {
      console.log('Error trying to find user', error);
    }
  }

  async update(email: string, user: CreateUserDto): Promise<User> {
    console.log('Updateing User with: ', user);
    if (typeof user.lenguagePreference !== 'string') {
      user.lenguagePreference = user.lenguagePreference[0];
    }

    const newUser: User = {
      email: user.email,
      birth_date: user.birthDate,
      name: user.name,
      lenguage_preference:
        typeof user.lenguagePreference === 'string'
          ? user.lenguagePreference
          : user.lenguagePreference[0],
      music_genres: user.musicGenres,
      profile_uri: user.profileUri,
    };

    return await this.userModel.findOneAndUpdate({ email: email }, newUser);
  }
}
