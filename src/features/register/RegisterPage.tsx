import { FormEvent, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Eyebrow } from '../../components/Eyebrow';
import { courseCatalog, type CourseId } from '../cip/data';

function getCourseId(value: string | null): CourseId {
  return value && value in courseCatalog ? value as CourseId : 'seminar';
}

export function RegisterPage() {
  const [searchParams] = useSearchParams();
  const course = courseCatalog[getCourseId(searchParams.get('course'))];
  const [pending, setPending] = useState(false);
  const [receiptCode, setReceiptCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setError(null);
    setReceiptCode(null);
    setPending(true);

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          name: form.get('name'),
          email: form.get('email'),
          phone: form.get('phone'),
          note: form.get('note'),
          website: form.get('website'),
        }),
      });
      const result = await response.json() as { receiptCode?: string; error?: string };
      if (!response.ok || !result.receiptCode) throw new Error(result.error || '目前無法送出報名申請，請稍後再試。');
      setReceiptCode(result.receiptCode);
      formElement.reset();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '目前無法送出報名申請，請稍後再試。');
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="register-layout container">
      <div className="register-intro" data-reveal>
        <Link className="back-link" to="/cip">← 返回 CIP 課程</Link>
        <Eyebrow showDot>CIP COURSE REGISTRATION</Eyebrow>
        <h1>報名 CIP<br /><em>培訓課程</em></h1>
        <p>填寫資料後可直接送出報名申請，我們收到後會與你確認課程梯次與認證需求。</p>
        <div className="register-course"><span>你選擇的培訓方向</span><strong>{course.title}</strong><small>{course.focus}</small></div>
        <p className="register-disclaimer">送出代表提出報名申請，尚不表示已取得課程名額。杉鼎森確認梯次後會再與你聯繫。</p>
      </div>
      <div>
        <form className="register-form" onSubmit={handleSubmit} onChange={() => { setError(null); setReceiptCode(null); }} data-reveal>
          <Eyebrow>YOUR DETAILS</Eyebrow><h2>留下聯絡資訊</h2>
          <label htmlFor="reg-name">姓名／稱呼 <span>*</span></label><input id="reg-name" name="name" autoComplete="name" maxLength={100} required placeholder="你的姓名" />
          <label htmlFor="reg-email">電子郵件 <span>*</span></label><input id="reg-email" name="email" type="email" autoComplete="email" maxLength={254} required placeholder="name@example.com" />
          <label htmlFor="reg-phone">聯絡電話</label><input id="reg-phone" name="phone" type="tel" autoComplete="tel" maxLength={50} placeholder="09xx xxx xxx" />
          <label htmlFor="reg-note">想先告訴我們的事</label><textarea id="reg-note" name="note" rows={4} maxLength={2000} placeholder="例如：想了解的課程內容與認證方向" />
          <div className="registration-honeypot" aria-hidden="true"><label htmlFor="reg-website">請勿填寫</label><input id="reg-website" name="website" tabIndex={-1} autoComplete="off" /></div>
          <button className="button button--dark" type="submit" disabled={pending}>{pending ? '送出中…' : '送出報名申請'} <span aria-hidden="true">↗</span></button>
          <p className="form-note">送出後會顯示受理編號。請保留編號，以便後續查詢。</p>
        </form>
        {error && <div className="registration-message registration-message--error" role="alert"><strong>尚未送出</strong><p>{error}</p></div>}
        {receiptCode && <div className="registration-message registration-message--success" role="status" aria-live="polite"><strong>已收到報名申請</strong><p>受理編號：<b>{receiptCode}</b></p><p>我們會依你提供的聯絡資料確認課程資訊。這個編號不代表名額已確認。</p></div>}
      </div>
    </section>
  );
}
