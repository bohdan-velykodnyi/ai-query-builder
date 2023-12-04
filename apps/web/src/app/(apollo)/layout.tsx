'use client';
import { AuthProvider } from 'apollo/auth-strategy';

export default function ApolloLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
