import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import ConfiguredToaster from "./_components/configured-toaster";

const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.className} antialiased`}>
				<Providers>
					{children}
					<ConfiguredToaster />
				</Providers>
			</body>
		</html>
	);
}
