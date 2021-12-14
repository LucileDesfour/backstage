/*
 * Copyright 2021 The Backstage Authors
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
import React, { useState } from 'react';
import { Box, Grid, IconButton } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  Table,
  TableColumn,
} from '@backstage/core-components';
import { useSecrets, useProjectId } from '../../api'
import { Delete, Edit} from '@material-ui/icons';
import { AddSecretComponent } from '../AddSecret/AddSecretComponent';



export const SecretsManagment = () => {


const columns: TableColumn[] = [
  { title: 'Secret Name', field: 'Name' },
  { title: 'Value', field: 'Value'},
  { title: 'Edit', field: 'Edit', render: (value) => {
    return (
      <div>
        <IconButton
          onClick={() => {
            handleDelete(value);
          }}
        >
          <Delete/>
        </IconButton>
        <IconButton
          onClick={() => {
            handleEdit(value);
          }}
        >
          <Edit/>
        </IconButton>
      </div>
    )
  }}
  ];
  
  const [appName] = useState(useProjectId());
  const secrets = useSecrets(appName);
  
  const [currentSecret, setCurrentSecret] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [open, setOpen] = useState(false);


  const formatedSecrets = secrets?.secrets?.map((secret) => {
    return {
      Name: secret.Name,
      Value: secret.Value
    };
  });

  async function handleEdit(secret: any) {
    setCurrentSecret(secret.Name)
    setCurrentValue(secret.Value)
    setOpen(true)
  }
  
  async function handleDelete(secret: any) {
    console.log(secret)
    await secrets.delete(secret.Name)
  }

  return (
  <Page themeId="tool">
    <Header title="AWS" subtitle="">

    </Header>
    <Content>
      <ContentHeader title="Secret Managment">
      </ContentHeader>
      <Box m={2}>
        <AddSecretComponent open={open} setOpen={setOpen} appName={appName}  currentSecret={currentSecret} setCurrentSecret={setCurrentSecret} currentValue={currentValue} setCurrentValue={setCurrentValue} secrets={secrets} />
      </Box>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <Table
            title="Environment Secret Keys"
            isLoading={secrets.loading}
            options={{search: false, paging: false}}
            totalCount={formatedSecrets?.length}
            columns={columns}
            data={formatedSecrets ?? []}
          />
        </Grid>
      </Grid>
    </Content>
  </Page>
  )
};






