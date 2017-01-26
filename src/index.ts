import 'reflect-metadata';

import * as express from 'express';
import * as logops from 'logops';

import { ReflectiveInjector } from '@angular/core';

const expressLogging = require('express-logging');

import { environment } from './environment';
import { providers } from './providers';

import { registerController } from './api-helpers';
import { DownloadController } from './controllers/download.controller';

const injector = ReflectiveInjector.resolveAndCreate(providers);
const downloadController: DownloadController = injector.get(DownloadController);

let app = express();
app.use(expressLogging(logops));

registerController(app, downloadController);

app.listen(environment.port, () => { console.log(`listening on port ${environment.port}`); });
