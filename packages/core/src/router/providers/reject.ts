// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {LogError, Reject} from '../../internal-types';
import {inject} from '@loopback/context';
import {ServerResponse, ServerRequest} from 'http';
import {HttpError} from 'http-errors';
import {CoreBindings} from '../../keys';

export class RejectProvider {
  constructor(
    @inject(CoreBindings.SequenceActions.LOG_ERROR)
    protected logError: LogError,
  ) {}

  value(): Reject {
    return (
      response: ServerResponse,
      request: ServerRequest,
      error: Error,
    ) => {
      const err = error as HttpError;
      const statusCode = err.statusCode || err.status || 500;
      response.statusCode = statusCode;
      response.end();

      this.logError(error, statusCode, request);
    };
  }
}
