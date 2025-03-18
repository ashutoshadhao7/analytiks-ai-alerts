import { Controller } from '@nestjs/common';
import { HasuraService } from './hasura.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('hasura')
@ApiTags('hasura')
export class HasuraController {
  constructor(private readonly hasuraService: HasuraService) {}
}
