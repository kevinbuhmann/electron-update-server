# electron-update-server
Serves private repo assets for electron updater.

## Installation

```
git clone https://github.com/kevinphelps/electron-update-server.git
cd electron-update-server
yarn
yarn run build
```

Substitute url for fork if needed.

## Configuration

Environment variables: (use `.env` file in project root for development)

```
GITHUB_ACCESS_TOKEN=TOKEN
```

## Development

Run `yarn run watch` and `yarn start` concurrently.

## Usage

`/download/:owner/:repo/:filename`: Download file from the latest release in the given repo.

## Deployment

Set up Heroku:

```
heroku git:remote -a APP_NAME
heroku buildpacks:set https://github.com/heroku/heroku-buildpack-nodejs#yarn
```

Push to Heroku:

```
git push heroku master
```
