import { useEffect, useLayoutEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import { useReveal } from './hooks/useReveal';
import { AboutPage } from './features/about/AboutPage';
import { AdminPage } from './features/admin/AdminPage';
import { CipPage } from './features/cip/CipPage';
import { HomePage } from './features/home/HomePage';
import { JournalPage } from './features/journal/JournalPage';
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
    description: '杉鼎森 CIP 國際職業認證培訓與申請諮詢，了解認證項目、申報條件、考試方式與培訓方向。',
  },
  '/about': {
    title: '關於我們｜杉鼎森數位工程',
    description: '認識杉鼎森數位工程的理念、團隊與合作方式。',
  },
  '/journal': {
    title: '工程師的心內話｜杉鼎森數位工程',
    description: '杉鼎森團隊的工程筆記、專案觀察與團隊札記，分享網站、企業系統及 AI 工具的實務經驗。',
  },
  '/register': {
    title: '課程報名｜杉鼎森數位工程',
    description: '杉鼎森 CIP 課程報名意向頁。',
  },
  '/admin': {
    title: '管理者後台｜杉鼎森數位工程',
    description: '杉鼎森管理者後台登入。',
  },
};

function ScrollToRoute() {
  const { pathname, search, hash } = useLocation();

  useLayoutEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (!hash) {
        window.scrollTo({ top: 0, behavior: 'instant' });
        return;
      }

      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;
      const headerHeight = document.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 0;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - headerHeight - 16,
        behavior: 'instant',
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, search, hash]);

  return null;
}

function BackToTop() {
  useEffect(() => {
    const update = () => document.body.classList.toggle('show-back-to-top', window.scrollY > 500);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      document.body.classList.remove('show-back-to-top');
    };
  }, []);

  return <button className="back-to-top" type="button" aria-label="回到頁面頂端" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑<span>回到頂端</span></button>;
}

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
      <ScrollToRoute />
      <SiteHeader />
      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/cip" element={<CipPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <SiteFooter />
      <BackToTop />
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
