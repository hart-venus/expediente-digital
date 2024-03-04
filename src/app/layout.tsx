'use client';
import "./globals.css";
import { LoginProvider } from "../../context/LoginContext";
import { usePathname } from "next/navigation";
import ProtectedLayout from "../../components/ProtectedLayout";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pn = usePathname();
  return (
    <html lang="en">
      <body>
        <LoginProvider>
          {
            pn === "/login" ? (
              <>
                {children}
              </>
            ) : (
              <ProtectedLayout>
                {children}
              </ProtectedLayout>
            )
          }        
        </LoginProvider>
      
      </body>
    </html>
  );
}
