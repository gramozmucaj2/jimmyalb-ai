export const metadata = {
  title: "jimmyalb.ai",
  description: "Il tuo assistente AI potenziato.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}