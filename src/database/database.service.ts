import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from 'src/config/config.keys';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { ConnectionOptions, DataSourceOptions } from 'typeorm';

export const databaseProviders = [
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        async useFactory(config: ConfigService){
            return {
                type: 'mysql' as 'mysql',
                username: process.env.DB_USER,
                password: process.env.PASSWORD,
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                migrations: [__dirname + '/migrations/*{.ts, .js}'],
                database: process.env.DATABASE,
                port: 3306
            } as DataSourceOptions
        }
    })
];