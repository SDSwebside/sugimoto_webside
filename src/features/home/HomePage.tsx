import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow } from '../../components/Eyebrow';
import { LineQr } from '../../components/LineQr';

function readIntroState() {
  try {
    return sessionStorage.getItem('sds-intro-seen') === '1';
  } catch {
    return false;
  }
}

export function HomePage() {
  const hasSeenIntro = readIntroState();
  const [showIntro, setShowIntro] = useState(!hasSeenIntro);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isStageReady, setIsStageReady] = useState(hasSeenIntro);
  const [shouldBurst, setShouldBurst] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const enterTimer = useRef<number | null>(null);

  useEffect(() => {
    document.body.classList.toggle('intro-active', showIntro);
    return () => document.body.classList.remove('intro-active');
  }, [showIntro]);

  useEffect(() => {
    if (!shouldBurst || !stageRef.current) return;
    const stage = stageRef.current;
    const center = stage.querySelector<HTMLElement>('.burst-stage__center')?.getBoundingClientRect();
    const cards = [...stage.querySelectorAll<HTMLElement>('.burst-card')];
    if (!center || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !Element.prototype.animate) {
      setIsStageReady(true);
      return;
    }

    setIsStageReady(true);
    const originX = center.left + center.width / 2;
    const originY = center.top + center.height / 2;
    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const dx = originX - (rect.left + rect.width / 2);
      const dy = originY - (rect.top + rect.height / 2);
      card.animate(
        [
          { transform: `translate(${dx}px, ${dy}px) scale(.2) rotate(${index % 2 ? 10 : -10}deg)`, opacity: 0, filter: 'blur(8px)' },
          { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1, filter: 'blur(0)' },
        ],
        { duration: 780, delay: 130 + index * 125, easing: 'cubic-bezier(.18,.8,.22,1)', fill: 'both' },
      );
    });
  }, [shouldBurst]);

  useEffect(() => () => {
    if (enterTimer.current) window.clearTimeout(enterTimer.current);
  }, []);

  const enterSite = () => {
    if (isLeaving) return;
    setIsLeaving(true);
    try {
      sessionStorage.setItem('sds-intro-seen', '1');
    } catch {
      // sessionStorage may be unavailable in privacy-restricted browsers.
    }
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    enterTimer.current = window.setTimeout(() => {
      setShowIntro(false);
      setShouldBurst(true);
    }, reducedMotion ? 0 : 570);
  };

  const replayIntro = () => {
    if (enterTimer.current) {
      window.clearTimeout(enterTimer.current);
      enterTimer.current = null;
    }
    try {
      sessionStorage.removeItem('sds-intro-seen');
    } catch {
      // Ignore storage errors and still replay in the current view.
    }
    setIsLeaving(false);
    setIsStageReady(false);
    setShouldBurst(false);
    setShowIntro(true);
  };

  return (
    <>
      {showIntro && (
        <div className={`intro${isLeaving ? ' is-leaving' : ''}`} role="dialog" aria-modal="true" aria-labelledby="intro-title">
          <div className="intro__grain" aria-hidden="true" />
          <div className="intro__inner">
            <Eyebrow className="intro__eyebrow"><span className="eyebrow__dot" /> SHAN DING SEN · DIGITAL ENGINEERING</Eyebrow>
            <button className="intro__logo-button" type="button" aria-label="點擊杉鼎森標誌進入網站" onClick={enterSite}>
              <img src="/assets/brand-logo.png" alt="杉鼎森標誌：森林、鼎與電路圖形" width="720" height="645" />
              <span className="intro__orbit intro__orbit--one" aria-hidden="true" />
              <span className="intro__orbit intro__orbit--two" aria-hidden="true" />
            </button>
            <h1 id="intro-title">杉鼎森數位工程<br />網站、系統與 AI 開發</h1>
            <p>從品牌網站、企業管理系統到 LINE AI，自規劃、開發到上線提供服務。</p>
            <button className="button button--dark intro__enter" type="button" onClick={enterSite}>點擊標誌・進入網站 <span aria-hidden="true">↗</span></button>
            <span className="intro__hint">SCROLL DOWN TO EXPLORE <span aria-hidden="true">↓</span></span>
          </div>
        </div>
      )}
      <section className="home-hero container" aria-labelledby="home-title">
        <div className="home-hero__heading" data-reveal>
          <Eyebrow showDot>DIGITAL ENGINEERING LAB</Eyebrow>
          <h1 id="home-title">杉鼎森數位工程</h1>
          <p>提供品牌網站、企業系統、LINE AI 與 CIP 培訓服務。<br />協助你規劃、開發並上線可實際使用的數位工具。</p>
        </div>
        <div className={`burst-stage${isStageReady ? '' : ' burst-stage--pending'}`} ref={stageRef} aria-label="網站四大功能入口">
          <Link className="burst-card burst-card--portfolio" to="/portfolio"><span className="burst-card__number">01 / PORTFOLIO</span><span className="burst-card__icon" aria-hidden="true">▦</span><span className="burst-card__bottom"><strong>作品介紹</strong><span aria-hidden="true">↗</span></span><small>查看網站與系統案例</small></Link>
          <Link className="burst-card burst-card--services" to="/services"><span className="burst-card__number">02 / SERVICES</span><span className="burst-card__icon" aria-hidden="true">⌘</span><span className="burst-card__bottom"><strong>我們提供的服務</strong><span aria-hidden="true">↗</span></span><small>網站、系統與 AI 開發</small></Link>
          <div className="burst-stage__center"><span className="burst-stage__ring burst-stage__ring--one" aria-hidden="true" /><span className="burst-stage__ring burst-stage__ring--two" aria-hidden="true" /><div className="boy-card"><img src="/assets/boy-illustration.png" alt="戴眼鏡、充滿靈感的男孩黑白插畫，周圍有科技與生活元素" width="1024" height="1536" /><span className="boy-card__label"><span className="eyebrow__dot" /> 將靈感變成真實</span></div></div>
          <Link className="burst-card burst-card--cip" to="/cip"><span className="burst-card__number">03 / CIP ACADEMY</span><span className="burst-card__icon" aria-hidden="true">✳</span><span className="burst-card__bottom"><strong>CIP 認證培訓</strong><span aria-hidden="true">↗</span></span><small>了解課程與申請方向</small></Link>
          <Link className="burst-card burst-card--about" to="/about"><span className="burst-card__number">04 / ABOUT US</span><span className="burst-card__icon" aria-hidden="true">◉</span><span className="burst-card__bottom"><strong>關於我們</strong><span aria-hidden="true">↗</span></span><small>認識打造作品的人</small></Link>
        </div>
        <button className="replay-link" type="button" onClick={replayIntro}>↺ 重新播放開場動畫</button>
      </section>
      <section className="statement-band" aria-label="服務方式"><div className="container statement-band__inner" data-reveal><span>PLAN · BUILD · SUPPORT</span><p>從需求訪談、介面設計到系統上線，<br />讓每個階段都有清楚的交付成果。</p><span>BUILT FOR DAILY WORK</span></div></section>
      <section className="section container home-preview" aria-labelledby="preview-title"><div className="section-heading" data-reveal><Eyebrow showDot>WHAT WE BUILD</Eyebrow><h2 id="preview-title">網站與企業系統案例</h2><p>查看網站設計、資料管理與自動化工具的實際呈現方式。</p></div><div className="preview-grid"><Link className="preview-card" to="/portfolio" data-reveal><img src="/assets/project-1.jpg" alt="建築品牌網站展示於桌上螢幕與平板" width="512" height="288" loading="lazy" /><div><span>SELECTED WORK / 01</span><h3>品牌網站設計與開發</h3><span className="round-arrow" aria-hidden="true">↗</span></div></Link><Link className="preview-card" to="/services" data-reveal><img src="/assets/project-2.jpg" alt="企業進銷存管理系統於桌上螢幕展示" width="512" height="288" loading="lazy" /><div><span>ENGINEERING / 02</span><h3>企業系統開發與整合</h3><span className="round-arrow" aria-hidden="true">↗</span></div></Link></div></section>
      <section className="contact-strip section" id="contact" aria-labelledby="contact-title"><div className="container contact-strip__inner" data-reveal><div><Eyebrow showDot>START A CONVERSATION</Eyebrow><h2 id="contact-title">洽談網站、系統<br />或 CIP 培訓</h2><p>告訴我們你的專案需求，或詢問 CIP 課程與認證準備方向。</p><Link className="button button--dark" to="/about#contact">查看聯絡方式 ↗</Link></div><div className="contact-placeholder"><LineQr /><strong>LINE 官方帳號</strong><small>使用 LINE 掃描 QR Code 加入好友</small></div></div></section>
    </>
  );
}
