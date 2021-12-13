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
import { SecretsManagerClient, ListSecretsCommand, Filter, GetSecretValueCommand, SecretListEntry, UpdateSecretCommand } from "@aws-sdk/client-secrets-manager"; // ES Modules import
import { readAwsConfigs } from '../config';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useEffect, useState } from 'react';

const FILTER_KEY = "name";

export const useProjectId = () => {
    const { entity } = useEntity();
    return entity.metadata.name;
}

export function useClient() {
    const config = useApi(configApiRef)

    const configAWS = readAwsConfigs(config.getConfig('aws'))
    return new SecretsManagerClient({
        region: configAWS.region,
        credentials: {
            accessKeyId: configAWS.accessKeyId,
            secretAccessKey: configAWS.secretAccessKey
        }
    });
}

export type Secret = {
    Value: string,
    Name: string
}

type FetchSecret = {
    secrets: Secret[],
    loading: boolean
}


const getSecrets = async (secretName: string, client: SecretsManagerClient): Promise<string> => {
    const paramsSecretValue = {SecretId: secretName}
    const commandSecretValue = new GetSecretValueCommand(paramsSecretValue);
    const value = await client.send(commandSecretValue);

    if (!value.SecretString) {
        return '';
    }
    return value?.SecretString
}


const parseSecret = async (secretName: string, client: SecretsManagerClient, secretList: Secret[]): Promise<void> => {
    let obj = JSON.parse(await getSecrets(secretName, client));
    const jsonKeys = Object.keys(obj)

    jsonKeys.map( (key) => {
        secretList.push({Name: key, Value: obj[key]})
    })
}

export const listSecrets = (): FetchSecret => {

    const [secrets, setSecrets] = useState<Secret[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const secretName = useProjectId();

    const client = useClient()

    useEffect(() => {
        (async () => {
            await parseSecret(secretName, client, secrets)

            setSecrets(secrets)
            setLoading(false)
            return {loading, secrets}
        })();
    }, []);
    return {loading, secrets}
}



export const updateSecrets = async (secretKey : string, secretValue : string, appName : string, client : SecretsManagerClient) => {

    const secrets = await getSecrets(appName, client)

    const jsonSecretString = secrets.slice(0, -1)  + ',"' + secretKey + '":"' + secretValue + '"}';

    const command = new UpdateSecretCommand({SecretId: appName, SecretString: jsonSecretString});
    await client.send(command);

}