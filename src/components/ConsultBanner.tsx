import { Link } from 'react-router-dom';
import { Eyebrow } from './Eyebrow';

interface ConsultBannerProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function ConsultBanner({ eyebrow, title, description }: ConsultBannerProps) {
  return (
    <section className="consult-banner container" data-reveal>
      <div>
        <Eyebrow showDot>{eyebrow}</Eyebrow>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="consult-banner__facts">
          <span>LINE 官方帳號：<strong>歡迎加入</strong></span>
          <span>服務時間：平日 09:30 - 18:30</span>
        </div>
        <Link className="button button--dark" to="/about#contact">與我們聯絡 ↗</Link>
      </div>
      <div className="consult-banner__qr">
        <img className="consult-banner__qr-code" src="/assets/SDS-line.png" alt="杉鼎森 LINE 官方帳號 QR Code" width="540" height="540" />
        <strong>加入 LINE 官方帳號</strong>
        <small>掃描 QR Code 與我們聯絡</small>
      </div>
    </section>
  );
}
