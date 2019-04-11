import { Test, TestingModule } from '@nestjs/testing';
import { ArchivosService } from './archivos.service';

describe('ArchivosService', () => {
  let service: ArchivosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArchivosService],
    }).compile();

    service = module.get<ArchivosService>(ArchivosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
