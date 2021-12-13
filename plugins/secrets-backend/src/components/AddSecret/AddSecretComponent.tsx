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
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Modal, Button, TextField, makeStyles, Box } from '@material-ui/core';
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { Add } from '@material-ui/icons';
import { updateSecrets, useClient, useProjectId } from '../../api';
import { useEntity } from '@backstage/plugin-catalog-react/src/hooks/useEntity';
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

function getModalStyle() {
    const top = 50;
    const left = 50;
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        position: 'absolute',
        width: 450,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

export const AddSecretComponent = forwardRef((props: { open: boolean, setOpen: any, appName: string; client: SecretsManagerClient, currentSecret: string, currentValue: string }) => {
    const [name, setName] = React.useState('');
    const [value, setValue] = React.useState('');

    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);



    console.log("props")
    console.log(props.open)

    const appName = props.appName;
    const client = props.client;

    const handleOpen = () => {
        console.log("open modal")
        props.setOpen(true);
    };

    const handleClose = () => {
        props.setOpen(false);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLInputElement>) => {  
        event.preventDefault();
        await updateSecrets(name, value, appName, client);
        window.location.reload();

    }

    React.useEffect(() => {
      console.log("lol")
      console.log(props)
      setName(props.currentSecret)
      setValue(props.currentValue)
    }, [props.open]);
    
    return (
        <div>
            <Button variant="contained" startIcon={<Add />} color="primary" onClick={handleOpen}>Add</Button>
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={props.open}
                onClose={handleClose}
            >
                <div style={modalStyle} className={classes.paper} onSubmit={(e) => handleSubmit(e)}>                  
                <h2>Add a new secret</h2>
                <Box m={1} p={2}>
                    <form>
                        <TextField
                            id="input-name"
                            label="Name"
                            variant="outlined"
                            value={name}
                            onChange={ e=>setName(e.target.value)}
                        />
                        <TextField
                                id="input-value"
                                label="Value"
                                variant="outlined"
                                value={value}
                                onChange={ e=>setValue(e.target.value)}
                        />
                        <Button type="submit"> 
                            Add
                        </Button>
                    </form>
                </Box>
                </div>
            </Modal>
        </div>
    );
});
