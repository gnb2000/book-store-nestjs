import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapperService } from './mapper.service';


@Module({
    providers: [MapperService],
    exports: [MapperService]
})
export class SharedModule {}