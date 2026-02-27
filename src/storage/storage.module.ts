import { Global, Module } from '@nestjs/common';
import { GcsService } from './services/gcs.service';

@Global()
@Module({
  providers: [GcsService],
  exports: [GcsService],
})
export class StorageModule {}
