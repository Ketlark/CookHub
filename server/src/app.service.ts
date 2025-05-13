import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import { writeFileSync } from 'fs';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  a
}
