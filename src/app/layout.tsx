import type { Metadata } from "next"; import "./globals.css";
export const metadata:Metadata={title:"Examgraph",description:"Mind-map-first exam preparation"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
