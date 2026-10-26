import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import { useReveal } from './hooks/useReveal';
import { AboutPage } from './features/about/AboutPage';
import { CipPage } from './features/cip/CipPage';
import { HomePage } from './features/home/HomePage';
import { PortfolioPage } from './features/portfolio/PortfolioPage';
import { RegisterPage } from './features/register/RegisterPage';
import { ServicesPage } from './features/services/ServicesPage';

const pageMeta: Record<string, { title: string; description: string }> = {
  '/': {
    title: '杉鼎森數位工程｜首頁',
    description: '杉鼎森數位工程，結合建築級的精準結構與數位技術，打造值得信任的網站與企業系統。',
  },
  '/portfolio': {
    title: '作品介紹｜杉鼎森數位工程',
    description: '杉鼎森數位工程作品介紹，從品牌網站、企業系統到 LINE AI 與資料儀表板。',
  },
  '/services': {
    title: '服務項目｜杉鼎森數位工程',
    description: '杉鼎森提供網頁製作、客製化進銷存、LINE AI 機器人、儀表板建置與其他系統工程委託。',
  },
  '/cip': {
    title: 'CIP 課程報名｜杉鼎森數位工程',
    description: '了解杉鼎森 CIP 課程，從研習會、初階、中階到高階，規劃個人與企業 IP 的打造與上線路徑。',
  },
  '/about': {
    title: '關於我們｜杉鼎森數位工程',
    description: '認識杉鼎森數位工程的理念、團隊與合作方式。',
  },
  '/register': {
    title: '課程報名｜杉鼎森數位工程',
    description: '杉鼎森 CIP 課程報名意向頁。',
  },
};

function AppRoutes() {
  const location = useLocation();
  useReveal(location.pathname);

  useEffect(() => {
    const meta = pageMeta[location.pathname] ?? pageMeta['/'];
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  }, [location.pathname]);

  return (
    <>
      <SiteHeader />
      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/cip" element={<CipPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <SiteFooter />
    </>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
