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

import { SecretsManagerClient, GetSecretValueCommand, UpdateSecretCommand } from "@aws-sdk/client-secrets-manager"; // ES Modules import
import { readAwsConfigs } from '../config';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useEffect, useState, useCallback } from 'react';

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

export type FetchSecret = {
    secrets: Secret[],
    loading: boolean
    refresh: () => void
    add: (secretKey : string, secretValue : string) => Promise<void>
    delete: (secretKey: string) => Promise<void>
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

export const useSecrets = (appName: string): FetchSecret => {

    const [secrets, setSecrets] = useState<Secret[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const client = useClient()

    const refresh = useCallback(async () => {
        await parseSecret(appName, client, secrets)

        setSecrets(secrets)
        setLoading(false)
        return {loading, secrets}
    }, [appName])

    const add = useCallback(async (secretKey : string, secretValue : string) : Promise<void> => {
        
            const newSecrets = secrets.filter(({Name}) => Name !== secretKey)
            const jsonSecretString = `{ ${newSecrets.map(({Name, Value}) => `"${Name}": "${Value}"`)} ,"${secretKey}":"${secretValue}"}`;

            const command = new UpdateSecretCommand({SecretId: appName, SecretString: jsonSecretString});
            
            const response = await client.send(command);
            
            if (response.$metadata.httpStatusCode === 200) {
                setSecrets([...newSecrets, {Value: secretValue, Name: secretKey}])
            }

    }, [appName, secrets, client])

    const deleteSecret = useCallback(async (secretKey: string) => {
        const newSecrets = secrets.filter(s => s.Name !== secretKey)

        const jsonSecretString = `{ ${newSecrets.map(({Name, Value}) => `"${Name}": "${Value}", `).join('').slice(0, -2)}}`;    
        
        const command = new UpdateSecretCommand({SecretId: appName, SecretString: jsonSecretString});
        const response = await client.send(command);
        if (response.$metadata.httpStatusCode === 200) {
            setSecrets(newSecrets)
        }
    }, [appName, secrets, client])

    useEffect(() => {
        refresh()
    }, []);
    return {loading, secrets, refresh, add, delete: deleteSecret}
}