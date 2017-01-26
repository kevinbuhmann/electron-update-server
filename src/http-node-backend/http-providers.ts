import { BaseRequestOptions, BaseResponseOptions, Http, RequestOptions, ResponseOptions } from '@angular/http';

import { NodeBackend } from './node-backend';

const requestOptionsProvider = {
  provide: RequestOptions,
  useClass: BaseRequestOptions
};

const responseOptionsProvider = {
  provide: ResponseOptions,
  useClass: BaseResponseOptions
};

const nodeBackendProvider = {
  provide: NodeBackend,
  useFactory: (options: ResponseOptions) => new NodeBackend(options),
  deps: [ ResponseOptions ]
};

const httpProvider = {
  provide: Http,
  useFactory: (backend: NodeBackend, options: RequestOptions) => new Http(backend, options),
  deps: [ NodeBackend, RequestOptions ]
};

export const httpProviders = [ requestOptionsProvider, responseOptionsProvider, nodeBackendProvider, httpProvider ];
