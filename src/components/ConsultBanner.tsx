import { Link } from 'react-router-dom';
import { Eyebrow } from './Eyebrow';
import { LineQr } from './LineQr';

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
          <span>LINE 官方帳號：<strong>掃描 QR Code 加入</strong></span>
          <span>服務時間：平日 09:30 - 18:30</span>
        </div>
        <Link className="button button--dark" to="/about#contact">與我們聯絡 ↗</Link>
      </div>
      <div className="consult-banner__qr">
        <LineQr className="consult-banner__qr-image" />
        <strong>杉鼎森 LINE 官方帳號</strong>
        <small>使用 LINE 掃描 QR Code 加入好友</small>
      </div>
    </section>
  );
}
