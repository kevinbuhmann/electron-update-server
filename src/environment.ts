const mode: 'development' | 'production' = process.env.NODE_ENV === 'production' ?
  'production' : 'development';

const port = process.env.PORT || 5000;
const token = process.env.GITHUB_ACCESS_TOKEN;

export const environment = { mode, port, token };
