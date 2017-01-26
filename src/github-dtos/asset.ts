import { User } from '.';

export interface Asset {
  url: string;
  id: number;
  name: string;
  label?: any;
  uploader: User;
  content_type: string;
  state: string;
  size: number;
  download_count: number;
  created_at: Date;
  updated_at: Date;
  browser_download_url: string;
}
