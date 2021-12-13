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
import { Typography, Grid, TextField, Button, IconButton } from '@material-ui/core';
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
  Table,
  TableColumn,
} from '@backstage/core-components';
import { ExampleFetchComponent } from '../ExampleFetchComponent';
import { listSecrets, updateSecrets, useClient, useProjectId } from '../../api'
import { Delete, Edit, Add} from '@material-ui/icons';
import { AddSecretComponent } from '../AddSecret/AddSecretComponent';



export const SecretsManagment = () => {


const columns: TableColumn[] = [
  { title: 'Secret Name', field: 'Name' },
  { title: 'Value', field: 'Value'},
  { title: 'Edit', field: 'Edit', render: (value) => {
    return (
      <div>
        <IconButton
          onClick={(event) => {
            handleDelete(event, value);
          }}
        >
          <Delete/>
        </IconButton>
        <IconButton
          onClick={(event) => {
            handleEdit(event, value);
          }}
        >
          <Edit/>
        </IconButton>
      </div>
    )
  }}
  ];

  const {loading, secrets} = listSecrets();

  const [appName] = useState(useProjectId());
  const [client] = useState(useClient());
  const [currentSecret, setCurrentSecret] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [open, setOpen] = React.useState(false);


  const formatedSecrets = secrets?.map((secret) => {
    return {
      Name: secret.Name,
      Value: secret.Value

    };
  });

  async function handleEdit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, secret: any) {
    setCurrentSecret(secret.Name)
    setCurrentValue(secret.Value)
    setOpen(true)
  
  }
  
  function handleDelete(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, value: any) {
    console.log("delete button")
    console.log(value)
  }

  return (
  <Page themeId="tool">
    <Header title="AWS" subtitle="">

    </Header>
    <Content>
      <ContentHeader title="Secret Managment">
        <SupportButton>A description of your plugin goes here.</SupportButton>
      </ContentHeader>
        <AddSecretComponent open={open} setOpen={setOpen} appName={appName} client={client} currentSecret={currentSecret} currentValue={currentValue} />
      <Grid container spacing={3} direction="column">
        <Grid item>
          <Table
            title="Environment Secret Keys"
            isLoading={loading}
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






