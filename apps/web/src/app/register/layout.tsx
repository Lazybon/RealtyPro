import { AuthPagesLayout } from '@/components/auth-pages-layout';

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthPagesLayout>{children}</AuthPagesLayout>;
}
