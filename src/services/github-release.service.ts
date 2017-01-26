import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { environment } from '../environment';
import { Asset, Release } from '../github-dtos';
import { GitHubApiRequestInit, GitHubApiService } from './github-api.service';
import { HttpUtilityService } from './http-utility.service';

@Injectable()
export class GitHubReleaseService {
  constructor(private api: GitHubApiService, private http: Http, private httpUtility: HttpUtilityService) {
  }

  getLatestRelease(owner: string, repo: string): Observable<Release> {
    let options: GitHubApiRequestInit = {
      accessToken: environment.token
    };

    return this.api.get<Release>(`repos/${owner}/${repo}/releases/latest`, options);
  }

  getAssetFileContentsUrl(asset: Asset): Observable<string> {
    let options: GitHubApiRequestInit = {
      accessToken: environment.token,
      headers: { 'Accept': 'application/octet-stream' }
    };

    let headers = this.api.getHeaders(options);

    return this.http.get(asset.url, { headers })
      .catch((response: Response) => Observable.of(response.status === 302 ? response.headers.get('location') : response.url));
  }

  getAssetFileContentsAsString(asset: Asset): Observable<string> {
    return this.getAssetFileContentsUrl(asset)
      .mergeMap(url => this.http.get(url))
      .map(response => response.text());
  }

  getAssetFileContentsAsStream(asset: Asset): Observable<NodeJS.ReadableStream> {
    return this.getAssetFileContentsUrl(asset)
      .mergeMap(url => this.httpUtility.rawGetRequest(url));
  }
}
