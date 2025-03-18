import { DataSource } from 'typeorm';
import { configService } from '../config/config.service';
import { loadEnvFromSecretsManager } from '../config/secrets-manager';
export const dataSource = loadDS();

async function loadDS() {
  await loadEnvFromSecretsManager();

  const typeormConfig = configService.getTypeOrmConfig();
  const dataSource = new DataSource({
    ...typeormConfig,
    migrations: [configService.getValue('ORM_MIGRATIONS_FOR_CLI')],
  });
  return dataSource;
}
