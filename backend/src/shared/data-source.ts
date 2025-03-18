import { DataSource } from 'typeorm';
import { configService } from '../config/config.service';

export const dataSource = new DataSource(configService.getTypeOrmConfig());
