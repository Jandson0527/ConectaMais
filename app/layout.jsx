import './globals.css';
import { CRMProvider } from '../context/CRMContext';

export const metadata = {
  title: 'Conecta Mais | Gestão Inteligente de Leads & Vendas',
  description: 'Sistema inteligente de gestão de marketing indoor, funil de vendas CRM, rede de telas e controle financeiro.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CRMProvider>
          {children}
        </CRMProvider>
      </body>
    </html>
  );
}
