import { Injectable } from '@angular/core';
import { ConnectionBackend, Request, ResponseOptions } from '@angular/http';

import { NodeConnection } from './node-connection';

@Injectable()
export class NodeBackend implements ConnectionBackend {
  constructor(private baseResponseOptions: ResponseOptions) {
  }

  public createConnection(request: Request): NodeConnection {
    return new NodeConnection(request, this.baseResponseOptions);
  }
}
