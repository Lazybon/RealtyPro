export function AuthPagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <div className="flex flex-1 items-center justify-center p-4">{children}</div>
      <p
        className="pb-6 text-center text-sm text-muted-foreground"
        data-testid="text-auth-copyright"
      >
        © {new Date().getFullYear()} RealtyPro. Все права защищены.
      </p>
    </div>
  );
}
