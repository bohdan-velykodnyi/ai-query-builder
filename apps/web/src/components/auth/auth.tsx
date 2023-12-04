'use client';
import Button from '@mui/material/Button';
import Input from '@mui/material/TextField';
import { useGlobalContext } from 'apollo/auth-strategy';
import s from 'components/auth/auth.module.css';
import { useState } from 'react';

enum AuthType {
  LOGIN,
  REGISTER,
}

export const Auth = () => {
  const [type, setType] = useState(AuthType.LOGIN);
  const { signIn, registration } = useGlobalContext();

  const toggleType = () => {
    if (type === AuthType.LOGIN) {
      setType(AuthType.REGISTER);
    } else {
      setType(AuthType.LOGIN);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement)
      .value;

    if (type === AuthType.REGISTER) {
      const name = (form.elements.namedItem('name') as HTMLInputElement).value;
      registration({ name, email, password }).catch((e: Error) => {
        throw new Error(e.message);
      });
    } else {
      signIn({ email, password }).catch(() => {
        return;
      });
    }
  };

  return (
    <div className={s.wrap}>
      <form onSubmit={onSubmit}>
        {type === AuthType.REGISTER && (
          <Input variant="outlined" name="name" label="Name" />
        )}
        <Input variant="outlined" name="email" label="Email" />
        <Input
          variant="outlined"
          name="password"
          label="Password"
          type="password"
        />
        <Button variant="contained" type="submit">
          {type === AuthType.LOGIN ? 'Login' : 'Register'}
        </Button>
      </form>
      <Button variant="text" onClick={toggleType}>
        {type === AuthType.LOGIN
          ? "Doesn't have an account? Register"
          : 'Back to Login'}
      </Button>
    </div>
  );
};
