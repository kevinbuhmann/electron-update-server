import { DownloadController } from './controllers/download.controller';

import { GitHubApiService } from './services/github-api.service';
import { GitHubReleaseService } from './services/github-release.service';
import { HttpUtilityService } from './services/http-utility.service';
import { UtilityService } from './services/utility.service';

import { httpProviders } from './http-node-backend/http-providers';

export const providers = [
  DownloadController,

  GitHubApiService,
  GitHubReleaseService,
  HttpUtilityService,
  UtilityService,

  ...httpProviders
];
