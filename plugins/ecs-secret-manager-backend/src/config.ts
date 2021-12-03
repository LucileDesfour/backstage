/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Config } from '@backstage/config';

/**
 * The configuration parameters for a single AWS S3 provider.
 *
 * @public
 */
export type AwsConfig = {
  /**
   * accessKeyId
   */
  accessKeyId: string;

  /**
   * secretAccessKey
   */
  secretAccessKey: string;


  /**
   * region
   */
   region: string;
};

/**
 * Reads a single Aws S3 integration config.
 *
 * @param config - The config object of a single integration
 * @public
 */

export function readAwsConfig(
  config: Config,
): AwsConfig {
  const accessKeyId = config.getString('accessKeyId');
  const secretAccessKey = config.getString('secretAccessKey');
  const region = config.getString('region');

  return { accessKeyId, secretAccessKey, region };
}

/**
 * Reads a set of AWS S3 integration configs, and inserts some defaults for
 * public Amazon AWS if not specified.
 *
 * @param configs - The config objects of the integrations
 * @public
 */
export function readAwsConfigs(
  config: Config,
): AwsConfig {
  return readAwsConfig(config);
}
