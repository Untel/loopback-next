// Copyright IBM Corp. 2014,2016. All Rights Reserved.
// Node module: loopback-boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

import * as util from 'util';
import {PluginBase} from '../plugin-base';

export default function(options) {
  return new Swagger(options);
};

class Swagger extends PluginBase {
  constructor(options) {
    super(options, 'apis', null);
  }

  start(context) {
    const app = context.app;
    const appConfig = context.instructions.application;
    // disable token requirement for swagger, if available
    const swagger = app.remotes().exports.swagger;
    if (!swagger) return;

    const requireTokenForSwagger = appConfig.swagger &&
      appConfig.swagger.requireToken;
    swagger.requireToken = requireTokenForSwagger || false;
  }
}
