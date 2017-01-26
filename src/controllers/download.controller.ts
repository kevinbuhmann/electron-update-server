import * as express from 'express';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import { Asset, Release } from '../github-dtos';
import { GitHubReleaseService } from '../services/github-release.service';
import { UtilityService } from '../services/utility.service';

import { Controller, Get } from '../api-helpers';

@Controller('/download')
export class DownloadController {
  constructor(private github: GitHubReleaseService, private utility: UtilityService) {
  }

  @Get('/:owner/:repo/:filename?')
  getReleaseAsset(req: express.Request, res: express.Response, next: express.NextFunction) {
    let owner = req.params.owner;
    let repo = req.params.repo;
    let filename = req.params.filename;

    return this.github.getLatestRelease(owner, repo)
      .mergeMap(release => this.findAsset(release, filename))
      .mergeMap(asset => {
        if (asset) {
          return this.streamAsset(asset, res);
        } else {
          next(); // fall through to 404 if path does not match
          return Observable.of(undefined);
        }
      });
  }

  private findAsset(release: Release, filename: string): Observable<Asset> {
    let result: Observable<Asset> = null;

    if (filename) {
      result = Observable.of(release.assets.find(asset => asset.name === filename));
    } else {
      let latestYmlAsset = release.assets.find(asset => asset.name === 'latest.yml');
      result = this.github.getAssetFileContentsAsString(latestYmlAsset)
        .map(latestYml => this.utility.parseYml(latestYml))
        .map(latestYml => release.assets.find(asset => asset.name === latestYml['path']));
    }

    return result;
  }

  private streamAsset(asset: Asset, res: express.Response) {
    let contentType = asset.name.endsWith('.yml') ?
      'text/yaml; charset=utf-8' : asset.content_type;

    let contentDisposition = asset.name.endsWith('.yml') ?
      '' : `attachment; filename=${asset.name}`;

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', asset.size.toString());
    res.setHeader('Content-Disposition', contentDisposition);

    return this.github.getAssetFileContentsAsStream(asset)
      .do(stream => { stream.pipe(res); });
  }
}
