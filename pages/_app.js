import '../styles/globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import { LanguageProvider } from '../components/LanguageProvider';

export default function App({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </LanguageProvider>
  );
}