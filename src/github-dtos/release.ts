import { Asset, User } from '.';

export interface Release {
  url: string;
  assets_url: string;
  upload_url: string;
  html_url: string;
  id: number;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: boolean;
  author: User;
  prerelease: boolean;
  created_at: Date;
  published_at: Date;
  assets: Asset[];
  tarball_url: string;
  zipball_url: string;
  body: string;
}
