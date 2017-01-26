import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/mergeMap';

const githubApiBaseUrl = 'https://api.github.com/';

interface IPaginationLinks {
  first?: string;
  prev?: string;
  next?: string;
  last?: string;
}

export interface GitHubApiRequestInit {
  accessToken: string;
  headers?: { [index: string]: string | string[] };
}

@Injectable()
export class GitHubApiService {
  constructor(private http: Http) {
  }

  get<T>(url: string, options: GitHubApiRequestInit): Observable<T> {
    url = url.startsWith(githubApiBaseUrl) ? url : `${githubApiBaseUrl}${url}`;

    let headers = this.getHeaders(options);

    return this.http.get(url, { headers })
      .mergeMap(response => {
        let results = Observable.of(response.json());

        let links = this.parseLinks(response.headers.get('Link'));
        if (links.next) {
          results = Observable.zip(results, this.get(links.next, options), (arr1: any[], arr2: any[]) => arr1.concat(arr2));
        }

        return results;
      });
  }

  put<T>(url: string, body: any, options: GitHubApiRequestInit): Observable<T> {
    url = url.startsWith(githubApiBaseUrl) ? url : `${githubApiBaseUrl}${url}`;

    let headers = this.getHeaders(options);

    return this.http.put(url, body, { headers })
      .map(response => response.json());
  }

  getHeaders(options: GitHubApiRequestInit) {
    let headers = new Headers();

    if (options.headers) {
      for (let name of Object.keys(options.headers)) {
        headers.set(name, options.headers[name]);
      }
    }

    headers.set('User-Agent', 'Electron Update Server');
    headers.set('Authorization', `Bearer ${options.accessToken}`);

    if (headers.has('Accept') === false) {
      headers.set('Accept', 'application/json');
    }

    return headers;
  }

  private parseLinks(linksHeader: string): IPaginationLinks {
    let links: { [key: string]: string } = {};

    if (linksHeader) {
      for (let link of linksHeader.split(',')) {
        let match = /<(.+)>; rel="(.+)"/.exec(link);
        links[match[2]] = match[1];
      }
    }

    return links;
  }
}
