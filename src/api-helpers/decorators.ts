import 'reflect-metadata';

import { Method, ObservableHandler, RouteDescriptor } from '.';

export const basePathKey = Symbol('basePath');
export const routesKey = Symbol('routes');

export function Controller(basePath: string) {
  return Reflect.metadata(basePathKey, basePath);
}

export function Use(path?: string) {
  return (target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<ObservableHandler>) => {
    let routes = getOwnRoutes(target);

    routes.push({method: undefined, path, key, handler: descriptor.value});
    return descriptor;
  };
}

export function Route(method: Method, path: string) {
  return (target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<ObservableHandler>) => {
    let routes = getOwnRoutes(target);

    routes.push({method, path, key, handler: descriptor.value});
    return descriptor;
  };
}

export function Get(path: string) {
  return Route('get', path);
}

export function Put(path: string) {
  return Route('put', path);
}

export function Post(path: string) {
  return Route('post', path);
}

export function Delete(path: string) {
  return Route('delete', path);
}

export function Patch(path: string) {
  return Route('patch', path);
}

export function Head(path: string) {
  return Route('head', path);
}

export function All(path: string) {
  return Route('all', path);
}

function getOwnRoutes(target: Object) {
  let routes: RouteDescriptor[] = Reflect.getOwnMetadata(routesKey, target);

  if (!routes) {
    routes = [];
    Reflect.defineMetadata(routesKey, routes, target);
  }

  return routes;
}
