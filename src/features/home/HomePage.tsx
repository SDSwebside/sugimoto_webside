import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow } from '../../components/Eyebrow';

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
            <h1 id="intro-title">讓每一個構想，<br />都有穩固的數位根基。</h1>
            <p>從品牌網站到企業系統，讓靈感與工程一起成長。</p>
            <button className="button button--dark intro__enter" type="button" onClick={enterSite}>點擊標誌・進入網站 <span aria-hidden="true">↗</span></button>
            <span className="intro__hint">SCROLL DOWN TO EXPLORE <span aria-hidden="true">↓</span></span>
          </div>
        </div>
      )}
      <section className="home-hero container" aria-labelledby="home-title">
        <div className="home-hero__heading" data-reveal>
          <Eyebrow showDot>DIGITAL ENGINEERING LAB</Eyebrow>
          <h1 id="home-title">靈感進發，<br /><em>工程成形。</em></h1>
          <p>從一個想法，到真正可運作的數位體驗。<br />我們把品牌的溫度，寫進每一個精準的系統細節。</p>
        </div>
        <div className={`burst-stage${isStageReady ? '' : ' burst-stage--pending'}`} ref={stageRef} aria-label="網站四大功能入口">
          <Link className="burst-card burst-card--portfolio" to="/portfolio"><span className="burst-card__number">01 / PORTFOLIO</span><span className="burst-card__icon" aria-hidden="true">▦</span><span className="burst-card__bottom"><strong>作品介紹</strong><span aria-hidden="true">↗</span></span><small>看見想法如何成為作品</small></Link>
          <Link className="burst-card burst-card--services" to="/services"><span className="burst-card__number">02 / SERVICES</span><span className="burst-card__icon" aria-hidden="true">⌘</span><span className="burst-card__bottom"><strong>我們提供的服務</strong><span aria-hidden="true">↗</span></span><small>讓系統回應真正的需求</small></Link>
          <div className="burst-stage__center"><span className="burst-stage__ring burst-stage__ring--one" aria-hidden="true" /><span className="burst-stage__ring burst-stage__ring--two" aria-hidden="true" /><div className="boy-card"><img src="/assets/boy-illustration.png" alt="戴眼鏡、充滿靈感的男孩黑白插畫，周圍有科技與生活元素" width="1024" height="1536" /><span className="boy-card__label"><span className="eyebrow__dot" /> 將靈感變成真實</span></div></div>
          <Link className="burst-card burst-card--cip" to="/cip"><span className="burst-card__number">03 / CIP ACADEMY</span><span className="burst-card__icon" aria-hidden="true">✳</span><span className="burst-card__bottom"><strong>CIP 課程報名</strong><span aria-hidden="true">↗</span></span><small>從個人 IP 到企業品牌</small></Link>
          <Link className="burst-card burst-card--about" to="/about"><span className="burst-card__number">04 / ABOUT US</span><span className="burst-card__icon" aria-hidden="true">◉</span><span className="burst-card__bottom"><strong>關於我們</strong><span aria-hidden="true">↗</span></span><small>認識打造作品的人</small></Link>
        </div>
        <button className="replay-link" type="button" onClick={replayIntro}>↺ 重新播放開場動畫</button>
      </section>
      <section className="statement-band" aria-label="品牌理念"><div className="container statement-band__inner" data-reveal><span>ROOTED IN IDEAS</span><p>以建築思維規劃結構，<br />以數位工程實現可能。</p><span>BUILT FOR WHAT'S NEXT</span></div></section>
      <section className="section container home-preview" aria-labelledby="preview-title"><div className="section-heading" data-reveal><Eyebrow showDot>WHAT WE BUILD</Eyebrow><h2 id="preview-title">精準落地的數位解方</h2><p>從首次接觸，到長期運作，我們讓每一段數位旅程都更清晰。</p></div><div className="preview-grid"><Link className="preview-card" to="/portfolio" data-reveal><img src="/assets/project-1.jpg" alt="建築品牌網站展示於桌上螢幕與平板" width="512" height="288" loading="lazy" /><div><span>SELECTED WORK / 01</span><h3>品牌網站與數位體驗</h3><span className="round-arrow" aria-hidden="true">↗</span></div></Link><Link className="preview-card" to="/services" data-reveal><img src="/assets/project-2.jpg" alt="企業進銷存管理系統於桌上螢幕展示" width="512" height="288" loading="lazy" /><div><span>ENGINEERING / 02</span><h3>讓系統成為企業的助力</h3><span className="round-arrow" aria-hidden="true">↗</span></div></Link></div></section>
      <section className="contact-strip section" id="contact" aria-labelledby="contact-title"><div className="container contact-strip__inner" data-reveal><div><Eyebrow showDot>START A CONVERSATION</Eyebrow><h2 id="contact-title">下一個想法，<br />一起完成。</h2><p>網站、企業系統、LINE AI 或 CIP 課程，歡迎和我們聊聊。</p><Link className="button button--dark" to="/about#contact">查看聯絡方式 ↗</Link></div><div className="contact-placeholder"><span className="contact-placeholder__icon" aria-hidden="true">LINE</span><strong>新的 LINE 官方帳號申請中</strong><small>開通後置入 QR Code</small></div></div></section>
    </>
  );
}
