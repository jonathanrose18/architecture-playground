import type { Metadata } from 'next';

import { Toaster } from '@workspace/ui/components/ui/sonner';

import '@workspace/ui/globals.css';

export const metadata: Metadata = { title: '01-Layered' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <html lang='en'>
         <body>
            {children}
            <Toaster />
         </body>
      </html>
   );
}
