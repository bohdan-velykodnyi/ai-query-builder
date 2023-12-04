'use client';
import { useMutation, useQuery } from '@apollo/client';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import StorageIcon from '@mui/icons-material/Storage';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import s from 'components/databases/databases.module.css';
import { DELETE_DATABASE } from 'components/databases/mutation/delete-database';
import { SAVE_DATABASE } from 'components/databases/mutation/save-database';
import { GET_ALL_DATABASES } from 'components/databases/query/get-all-databases';
import Link from 'next/link';
import { useState } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: '4px',
  display: 'grid',
  gap: '10px',
};

export const Databases = () => {
  const [openModal, setOpenModal] = useState(false);
  const { data } = useQuery(GET_ALL_DATABASES);
  const [saveDatabase] = useMutation(SAVE_DATABASE, {
    refetchQueries: [{ query: GET_ALL_DATABASES }],
  });

  const [deleteDatabaseMutation] = useMutation(DELETE_DATABASE, {
    refetchQueries: [{ query: GET_ALL_DATABASES }],
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const database = (form.elements.namedItem('database') as HTMLInputElement)
      .value;
    const host = (form.elements.namedItem('host') as HTMLInputElement).value;
    const port = (form.elements.namedItem('port') as HTMLInputElement).value;
    const username = (form.elements.namedItem('username') as HTMLInputElement)
      .value;
    const password = (form.elements.namedItem('password') as HTMLInputElement)
      .value;

    saveDatabase({
      variables: {
        database,
        host,
        port,
        username,
        password,
      },
    })
      .then(() => {
        setOpenModal(false);
      })
      .catch((e: Error) => {
        throw new Error(e.message);
      });
  };

  const deleteDatabase = (db_id: string) => {
    deleteDatabaseMutation({ variables: { id: db_id } }).catch((e: Error) => {
      throw new Error(e.message);
    });
  };

  return (
    <>
      <div className={s.wrap}>
        <div onClick={() => setOpenModal(true)}>
          <Card variant="outlined" className={s.addNew}>
            <CardContent className={s.newDb}>
              <div className={s.title}>
                <Typography color="textSecondary" gutterBottom>
                  Add new
                </Typography>
                <AddIcon fontSize="large" />
              </div>
            </CardContent>
          </Card>
        </div>
        {data?.getAllDatabases.map((item) => {
          return (
            <Card key={item.id} variant="outlined" className={s.card}>
              <CardContent className={s.cardContent}>
                <div className={s.title}>
                  <Typography color="textSecondary" gutterBottom>
                    {item.database}
                  </Typography>
                  <StorageIcon />
                </div>
                <Button
                  variant="contained"
                  onClick={() => deleteDatabase(item.id as string)}
                >
                  <DeleteForeverIcon />
                </Button>
              </CardContent>
              <CardActions>
                <Link href={`/chat/${item.id as string}`}>
                  <Button size="small">Go to chat</Button>
                </Link>
              </CardActions>
            </Card>
          );
        })}
      </div>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form onSubmit={onSubmit}>
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add new database
            </Typography>
            <TextField variant="outlined" name="database" label="Database" />
            <TextField variant="outlined" name="host" label="Host" />
            <TextField variant="outlined" name="port" label="Port" />
            <TextField variant="outlined" name="username" label="Username" />
            <TextField variant="outlined" name="password" label="Password" />
            <Button variant="contained" type="submit">
              Save
            </Button>
          </Box>
        </form>
      </Modal>
    </>
  );
};
