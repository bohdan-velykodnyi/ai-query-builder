'use client';
import { useQuery } from '@apollo/client';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Button } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { useGlobalContext } from 'apollo/auth-strategy';
import { GET_CURRENT_USER } from 'apollo/querys/get-current-user';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function ApolloLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useQuery(GET_CURRENT_USER);
  const { signOut } = useGlobalContext();
  const router = useRouter();
  const params = useParams();

  const logout = () => {
    signOut()
      .then(() => {
        router.push('/');
      })
      .catch((e: Error) => {
        throw new Error(e.message);
      });
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            {params.id && (
              <Link href="/databases" style={{ color: 'white' }}>
                <Button color="inherit" variant="outlined">
                  Back to databases
                </Button>
              </Link>
            )}
            <IconButton
              sx={{ flexGrow: 1, justifyContent: 'flex-end' }}
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
            >
              <p style={{ fontSize: '18px', marginRight: '20px' }}>
                {data?.getCurrentUser.name}
              </p>
              <AccountCircle />
            </IconButton>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      {children}
    </div>
  );
}
