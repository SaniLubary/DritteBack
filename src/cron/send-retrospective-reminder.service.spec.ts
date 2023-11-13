import { Test, TestingModule } from '@nestjs/testing';
import { SendRetrospectiveReminderService } from './send-retrospective-reminder.service';

describe('SendRetrospectiveReminderService', () => {
  let service: SendRetrospectiveReminderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendRetrospectiveReminderService],
    }).compile();

    service = module.get<SendRetrospectiveReminderService>(SendRetrospectiveReminderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
