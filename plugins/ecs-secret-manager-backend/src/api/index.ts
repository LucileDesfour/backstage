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


import { configApiRef, useApi} from '@backstage/core-plugin-api';

// const { ECSClient, ListTaskDefinitionsCommand } = require("@aws-sdk/client-ecs");
import { ECSClient, ListTaskDefinitionsCommand } from "@aws-sdk/client-ecs"
import { SecretsManagerClient, ListSecretsCommand, Filter } from "@aws-sdk/client-secrets-manager"; // ES Modules import
import {  AwsConfig, readAwsConfigs } from '../config';
import { Credentials } from 'aws-sdk/lib/credentials';
import { Config } from '@backstage/config';


export async function listTaskDefinition() {
    const client = new ECSClient({ region: "us-east-2" });
    const params = {
    };

    const command = new ListTaskDefinitionsCommand(params);
    try {
        const data = await client.send(command);
        return data;
      } catch (error) {
          return error
    }
}

export async function listSecrets() {

    const config = useApi(configApiRef)

    const configAWS = readAwsConfigs(config.getConfig('aws'))

    const filter: Filter = {
        Key: "tag-value",
        Values: ["MyApp"]
    };

    const client = new SecretsManagerClient({ region: "us-east-2", credentials: {accessKeyId: configAWS.accessKeyId, secretAccessKey: configAWS.secretAccessKey}});
    const params = {
        Filters: [filter]
    };

    const command = new ListSecretsCommand(params);
    try {
        const data = await client.send(command);
        // process data.
        return data;
      } catch (error) {
          return error
        // error handling.
    }
}
