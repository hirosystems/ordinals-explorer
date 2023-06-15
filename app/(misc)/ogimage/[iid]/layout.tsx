import "./misc.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="m-0 font-['Aeonik_Fono']">{children}</body>
    </html>
  );
}
