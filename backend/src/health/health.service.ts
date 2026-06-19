import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  check() {
    return {
      status: 'ok',
      service: 'pitchpulse-api',
      timestamp: new Date().toISOString(),
    };
  }
}
