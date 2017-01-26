import * as http from 'http';
import * as https from 'https';
import * as url from 'url';

import { isPresent } from '@angular/common/src/facade/lang';
import { isSuccess } from '@angular/http/src/http_utils';

import { Connection, Headers, ReadyState, Request, RequestMethod, Response, ResponseOptions, ResponseType } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';

export class NodeConnection implements Connection {
  public readyState: ReadyState;
  public response: Observable<Response>;

  constructor(public request: Request, baseResponseOptions?: ResponseOptions) {
    let urlInfo = url.parse(request.url);

    let requestOptions: http.RequestOptions = {
      protocol: urlInfo.protocol,
      host: urlInfo.host,
      hostname: urlInfo.hostname,
      method: RequestMethod[request.method].toUpperCase(),
      port: parseInt(urlInfo.port, 10),
      path: urlInfo.path,
      auth: urlInfo.auth
    };

    if (isPresent(request.headers)) {
      requestOptions.headers = {};
      request.headers.forEach((values, name) => requestOptions.headers[name] = values.join(','));
    }

    this.response = new Observable((observer: Observer<Response>) => {
      let protocolRequest = requestOptions.protocol === 'https:' ? https.request : http.request;

      let nodeRequest = protocolRequest(requestOptions, (nodeResponse: http.IncomingMessage) => {
        let body = '';
        nodeResponse.on('data', (chunk) => body += chunk);

        let status = nodeResponse.statusCode;
        let headers = new Headers(nodeResponse.headers);
        let url = request.url;

        nodeResponse.on('end', () => {
          let responseOptions = new ResponseOptions({ body, status, headers, url });
          let response = new Response(responseOptions);

          if (isSuccess(status)) {
            observer.next(response);
            observer.complete();
          } else {
            observer.error(response);
          }
        });
      });

      let onError = (error: any) => {
        let responseOptions = new ResponseOptions({ body: error, type: ResponseType.Error });

        if (isPresent(baseResponseOptions)) {
          responseOptions = baseResponseOptions.merge(responseOptions);
        }

        observer.error(new Response(responseOptions));
      };

      nodeRequest.on('error', onError);

      nodeRequest.write(request.text());
      nodeRequest.end();

      return () => {
        nodeRequest.removeListener('error', onError);
        nodeRequest.abort();
      };
    });
  }
}
