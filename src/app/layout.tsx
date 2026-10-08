import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = {title:"Mumatec Hosting | Hosting made simple",description:"Web hosting, domains and website services from Mumatec."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}