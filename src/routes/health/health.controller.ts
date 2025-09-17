/* eslint-disable no-unused-vars */
// src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from 'src/shared/services/prisma.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private prisma: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check health of server and DB' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async check() {
    return this.health.check([
      () => this.http.pingCheck('local-server', `http://20.17.97.172:8000`),

      // Kiểm tra DB bằng Prism
      // test
      async () => {
        try {
          await this.prisma.$queryRaw`SELECT 1`;
          return { prisma: { status: 'up' } };
        } catch (err) {
          return { prisma: { status: 'down', message: err.message } };
        }
      },
    ]);
  }
}
