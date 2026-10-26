import { FormEvent, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Eyebrow } from '../../components/Eyebrow';
import { courseCatalog, type CourseId } from '../cip/data';

function getCourseId(value: string | null): CourseId {
  return value && value in courseCatalog ? value as CourseId : 'seminar';
}

export function RegisterPage() {
  const [searchParams] = useSearchParams();
  const course = courseCatalog[getCourseId(searchParams.get('course'))];
  const [submitted, setSubmitted] = useState(false);
  const courseLabel = useMemo(() => course.title, [course.title]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const lines = [
      `報名課程：${course.title}`,
      `姓名：${form.get('name')}`,
      `電子郵件：${form.get('email')}`,
      `電話：${form.get('phone') || '未填寫'}`,
      `補充說明：${form.get('note') || '無'}`,
    ];
    setSubmitted(true);
    window.location.href = `mailto:contact@shandingsen.com?subject=${encodeURIComponent(`CIP 課程報名意向｜${course.title}`)}&body=${encodeURIComponent(lines.join('\n'))}`;
  };

  return (
    <section className="register-layout container">
      <div className="register-intro" data-reveal><Link className="back-link" to="/cip">← 返回 CIP 課程</Link><Eyebrow showDot>CIP COURSE REGISTRATION</Eyebrow><h1>一起踏出<br /><em>下一步。</em></h1><p>填寫課程報名意向，讓我們了解你想參加的課程。</p><div className="register-course"><span>你選擇的課程</span><strong>{courseLabel}</strong><small>{course.hoursLabel}</small></div><p className="register-disclaimer">目前為報名頁原型，尚未串接正式報名系統。送出按鈕會開啟你裝置上的電子郵件軟體，請確認收件地址後寄出。</p></div>
      <form className="register-form" onSubmit={handleSubmit} data-reveal><Eyebrow>YOUR DETAILS</Eyebrow><h2>留下聯絡資訊</h2><label htmlFor="reg-name">姓名／稱呼 <span>*</span></label><input id="reg-name" name="name" autoComplete="name" required placeholder="你的姓名" /><label htmlFor="reg-email">電子郵件 <span>*</span></label><input id="reg-email" name="email" type="email" autoComplete="email" required placeholder="name@example.com" /><label htmlFor="reg-phone">聯絡電話</label><input id="reg-phone" name="phone" type="tel" autoComplete="tel" placeholder="09xx xxx xxx" /><label htmlFor="reg-note">想先告訴我們的事</label><textarea id="reg-note" name="note" rows={4} placeholder="例如：目前的品牌階段、想了解的課程內容" /><button className="button button--dark" type="submit">開啟郵件送出意向 <span aria-hidden="true">↗</span></button><p className="form-note">{submitted ? '已準備郵件內容，請在郵件軟體中確認並寄出。' : '正式報名網址提供後，可直接替換課程卡片連結。'}</p></form>
    </section>
  );
}
