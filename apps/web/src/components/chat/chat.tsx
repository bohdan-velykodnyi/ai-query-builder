'use client';
import { useMutation } from '@apollo/client';
import SendIcon from '@mui/icons-material/Send';
import {
  Divider,
  Fab,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import s from 'components/chat/chat.module.css';
import { SEND_MESSAGE } from 'components/chat/mutation/send-message';
import { useParams } from 'next/navigation';
import { useState } from 'react';

interface Message {
  text: string;
  time: string;
  role: 'system' | 'user';
}

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: '100%',
    height: '100vh',
  },
  headBG: {
    backgroundColor: '#e0e0e0',
  },
  borderRight500: {
    borderRight: '1px solid #e0e0e0',
  },
  messageArea: {
    height: '80dvh',
    overflowY: 'auto',
  },
});

export const Chat = () => {
  const [sendMessageMutation] = useMutation(SEND_MESSAGE);
  const classes = useStyles();
  const params = useParams();
  const [messages, setMessages] = useState<Message[]>([]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const date = new Date();
    const message = (form.elements.namedItem('message') as HTMLInputElement)
      .value;

    setMessages((prev) => [
      ...prev,
      {
        text: message,
        time: `${date.getHours()}:${date.getMinutes()}`,
        role: 'user',
      },
    ]);

    sendMessageMutation({
      variables: { message, database_id: params.id },
    })
      .then((r) => {
        setMessages((prev) => [
          ...prev,
          {
            text: r.data.sendMessage,
            time: `${date.getHours()}:${date.getMinutes()}`,
            role: 'system',
          },
        ]);
      })
      .catch((e: Error) => {
        throw new Error(e.message);
      });
  };

  return (
    <div className={s.wrap}>
      <Grid container component={Paper} className={classes.chatSection}>
        <Grid item xs={9} style={{ flexBasis: '100%', maxWidth: '100%' }}>
          <List className={classes.messageArea}>
            {messages.map((message, index) => (
              <ListItem key={index + 1}>
                <Grid container>
                  <Grid item xs={12}>
                    <ListItemText
                      style={{
                        textAlign: message.role === 'system' ? 'left' : 'right',
                      }}
                      primary={message.text}
                    ></ListItemText>
                  </Grid>
                  <Grid item xs={12}>
                    <ListItemText
                      style={{
                        textAlign: message.role === 'system' ? 'left' : 'right',
                      }}
                      secondary={message.time}
                    ></ListItemText>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
          <Divider />
          <form onSubmit={onSubmit}>
            <Grid container style={{ padding: '20px' }}>
              <Grid item xs={11}>
                <TextField
                  id="outlined-basic-email"
                  label="Type Something"
                  name="message"
                  fullWidth
                />
              </Grid>
              <Grid xs={1} item style={{ textAlign: 'right' }}>
                <Fab type="submit" color="primary" aria-label="add">
                  <SendIcon />
                </Fab>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </div>
  );
};
