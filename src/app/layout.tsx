
import { Toaster } from 'sonner';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>{children}
        <Toaster 
          position="top-right"
          richColors
          expand={true}
          duration={4000}
        /></body>
    </html>
  );
}