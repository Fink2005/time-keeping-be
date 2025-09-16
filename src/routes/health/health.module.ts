// src/health/health.module.ts
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { SharedModule } from 'src/shared/shared.module';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule, SharedModule, HttpModule],
  controllers: [HealthController],
})
export class HealthModule {}
