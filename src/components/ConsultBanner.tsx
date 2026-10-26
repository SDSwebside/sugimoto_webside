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
          <span>LINE 官方帳號：<strong>申請中</strong></span>
          <span>服務時間：平日 09:30 - 18:30</span>
        </div>
        <Link className="button button--dark" to="/about#contact">與我們聯絡 ↗</Link>
      </div>
      <div className="consult-banner__qr">
        <span className="consult-banner__qr-slot" aria-hidden="true">LINE</span>
        <strong>官方帳號申請中</strong>
        <small>開通後置入 QR Code</small>
      </div>
    </section>
  );
}
