import Button from '@mui/material/Button';
import s from 'components/landing/landing.module.css';
import Link from 'next/link';

export const Landing = () => {
  return (
    <div className={s.wrap}>
      <Link href="/auth">
        <Button variant="contained">Login</Button>
      </Link>
    </div>
  );
};
