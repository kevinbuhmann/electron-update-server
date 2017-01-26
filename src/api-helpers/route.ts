import * as express from 'express';

export type Method = 'get' | 'put' | 'post' | 'delete' | 'patch' | 'head' | 'all';

export type ObservableHandler = (req: express.Request, res: express.Response, next?: express.NextFunction) => any;

export interface RouteDescriptor {
  method: Method;
  path: string;
  key: string | symbol;
  handler: ObservableHandler;
};
