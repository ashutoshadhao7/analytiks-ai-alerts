import { Global, Module } from '@nestjs/common';
import { HasuraService } from './hasura.service';
import { HasuraController } from './hasura.controller';

@Global()
@Module({
  controllers: [HasuraController],
  providers: [HasuraService],
  exports: [HasuraService],
})
export class HasuraModule {}
