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
import { readAwsConfigs } from '../config';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useEffect, useState } from 'react';

const FILTER_KEY = "tag-value";

const useProjectId = () => {
    const { entity } = useEntity();
    return entity.metadata.name;
}

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

export type Secret = {
    CreatedDate: Date,
    LastChangedDate: Date,
    Name: string
}

type FetchSecret = {
    secrets: Secret[],
    loading: boolean
}

export const listSecrets = (): FetchSecret => {

    const [secrets, setSecrets] = useState<Secret[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const config = useApi(configApiRef)

    const configAWS = readAwsConfigs(config.getConfig('aws'))

    const filter: Filter = {
        Key: FILTER_KEY,
        Values: [useProjectId()]
    };

    const client = new SecretsManagerClient({ 
        region: configAWS.region, 
        credentials: {
            accessKeyId: configAWS.accessKeyId, 
            secretAccessKey: configAWS.secretAccessKey
        }
    });
    
    const params = {
        Filters: [filter]
    };

    useEffect(() => {
        (async () => {
            console.log("i go there")
            const command = new ListSecretsCommand(params);
            const data = await client.send(command);
            console.log(data)
            data.SecretList?.forEach(function (secret) {
                secrets.push({CreatedDate: secret?.CreatedDate as Date, LastChangedDate: secret?.LastChangedDate as Date, Name: secret.Name as string})
            })
            console.log(secrets)
            const formatedSecrets = secrets.map(secret => {
                return {
                  Name: secret.Name,
                  CreatedDate: secret.CreatedDate,
                  LastChangedDate: secret.LastChangedDate,
                };
              });
            setSecrets(formatedSecrets)
            setLoading(false)
        })();
    }, []);

    return {loading, secrets}
}