import { Injectable } from '@nestjs/common';

@Injectable()
export class StoreService {

  getValue(key: string) {
    return key + ':abc';
  }
}
