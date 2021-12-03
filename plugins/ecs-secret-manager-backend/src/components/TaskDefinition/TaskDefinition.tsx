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
import React from 'react';
import { Typography, Grid } from '@material-ui/core';
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
import { listSecrets } from '../../api'

const columns: TableColumn[] = [
  { title: 'Secret Name', field: 'Name' },
  { title: 'Created Date', field: 'CreatedDate' },
  { title: 'Last Changed Date', field: 'LastChangedDate' },
];

export const TaskDefinition = () => {

  const {loading, secrets} = listSecrets();

  const formatedSecrets = secrets?.map(secret => {
    return {
      Name: secret.Name,
      CreatedDate: secret.CreatedDate.toDateString(),
      LastChangedDate: secret.LastChangedDate.toDateString(),
    };
  });

  return (
  <Page themeId="tool">
    <Header title="AWS" subtitle="">

    </Header>
    <Content>
      <ContentHeader title="Secret Managment">
        <SupportButton>A description of your plugin goes here.</SupportButton>
      </ContentHeader>
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
