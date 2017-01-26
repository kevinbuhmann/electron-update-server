import * as http from 'http';
import * as https from 'https';
import * as url from 'url';

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class HttpUtilityService {
  toQueryString(obj: any): string {
    let params: string[] = [];

    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        params.push(`${encodeURIComponent(prop)}=${encodeURIComponent(obj[prop])}`);
      }
    }

    return params.join('&');
  }

  rawGetRequest(requestUrl: string): Observable<NodeJS.ReadableStream> {
    let urlInfo = url.parse(requestUrl);

    let requestOptions: https.RequestOptions = {
      protocol: urlInfo.protocol,
      host: urlInfo.host,
      hostname: urlInfo.hostname,
      method: 'GET',
      port: parseInt(urlInfo.port, 10),
      path: urlInfo.path,
      auth: urlInfo.auth
    };

    let protocolRequest = requestOptions.protocol === 'https:' ? https.request : http.request;

    return new Observable<NodeJS.ReadableStream>((observer: Observer<NodeJS.ReadableStream>) => {
      let assetContentsRequest = protocolRequest(requestOptions, response => {
        observer.next(response);
        observer.complete();
      });

      assetContentsRequest.end();
    });
  }
}
