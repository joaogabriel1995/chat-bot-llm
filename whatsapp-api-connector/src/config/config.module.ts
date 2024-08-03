import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { generalSchema } from './validation/general.schema';

@Module({
    imports: [ConfigModule.forRoot({
        isGlobal: true,
        validationSchema: generalSchema,
    }),]
})
export class ConfigAppModule { }
