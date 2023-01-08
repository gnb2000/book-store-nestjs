import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({
    providers: [
        {
            provide: ConfigService,
            useValue: new ConfigService(),
        }, //Cada vez que utilicemos este modulo en otro lado, vamos a tener una nueva instancia de ConfigService
    ],
    exports: [ConfigService],
})
export class ConfigModule {}
