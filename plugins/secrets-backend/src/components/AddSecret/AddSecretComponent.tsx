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
import React, { FormEvent } from 'react';
import { Modal, Button, TextField, Box } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { FetchSecret } from '../../api';

export interface AddSecretComponentProps {
    open: boolean,
    setOpen: any,
    appName: string;
    currentSecret: string,
    setCurrentSecret: any,
    currentValue: string,
    setCurrentValue: any,
    secrets: FetchSecret
}

export const AddSecretComponent = ({secrets, ...props}: AddSecretComponentProps) => {
    const [name, setName] = React.useState('');
    const [value, setValue] = React.useState('');

    const [title, setTitle] = React.useState('Create secret');

    const handleOpen = () => {
        props.setOpen(true);
        props.setCurrentSecret('')
        props.setCurrentValue('')
    };

    const handleClose = () => {
        props.setOpen(false);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLInputElement>) => {  
        event.preventDefault();
        await secrets.add(name, value)
        handleClose()
    }

    React.useEffect(() => {
      setName(props.currentSecret)
      setValue(props.currentValue)

      if (props.currentSecret != '') {
          setTitle("Update ")
      } else setTitle("Add ")
    }, [props.open]);
    
    return (
        <div>
            <Button variant="contained" startIcon={<Add />} color="primary" onClick={handleOpen}>Add</Button>
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={props.open}
                style={{display:'flex',alignItems:'center',justifyContent:'center'}}                onClose={handleClose}
            >
                <Box onSubmit={(e) => handleSubmit(e as FormEvent<HTMLInputElement>)} sx={{
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}>
                <h2>{title} Secret</h2>
                <Box m={2} p={3} >
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
                        <Box m={2} sx={{ display: 'flex', flexDirection: 'row-reverse'}}>
                            <Button variant="contained" startIcon={<Add />} color="primary" type="submit">{title}</Button>
                        </Box>
                    </form>
                </Box>
                </Box>
            </Modal>
        </div>
    );
};
