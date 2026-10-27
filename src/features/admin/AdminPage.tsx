import { FormEvent, useEffect, useState } from 'react';
import { Eyebrow } from '../../components/Eyebrow';
import { courseCatalog, type CourseId } from '../cip/data';

type RegistrationStatus = 'new' | 'contacting' | 'confirmed' | 'cancelled';

interface Registration {
  id: string;
  receiptCode: string;
  courseId: CourseId;
  name: string;
  email: string;
  phone: string;
  note: string;
  status: RegistrationStatus;
  adminNote: string;
  createdAt: string;
}

const statusLabels: Record<RegistrationStatus, string> = {
  new: '待聯繫',
  contacting: '聯繫中',
  confirmed: '已確認',
  cancelled: '已取消',
};

async function responseJson(response: Response) {
  try {
    return await response.json() as { error?: string; registrations?: Registration[] };
  } catch {
    throw new Error('本機 API 尚未啟動，請啟動完整開發服務。');
  }
}

function RegistrationCard({ registration }: { registration: Registration }) {
  const [status, setStatus] = useState<RegistrationStatus>(registration.status);
  const [adminNote, setAdminNote] = useState(registration.adminNote);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const save = async () => {
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch(`/api/admin/registrations/${registration.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNote }),
      });
      const result = await responseJson(response);
      if (!response.ok) throw new Error(result.error || '儲存失敗。');
      setMessage('已儲存');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '儲存失敗。');
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="admin-registration">
      <div className="admin-registration__top"><div><span>{registration.receiptCode}</span><h3>{registration.name}</h3></div><time dateTime={registration.createdAt}>{new Date(registration.createdAt).toLocaleString('zh-TW')}</time></div>
      <dl>
        <div><dt>課程</dt><dd>{courseCatalog[registration.courseId]?.title ?? registration.courseId}</dd></div>
        <div><dt>電子郵件</dt><dd>{registration.email}</dd></div>
        <div><dt>電話</dt><dd>{registration.phone || '未填寫'}</dd></div>
        <div><dt>備註</dt><dd>{registration.note || '無'}</dd></div>
      </dl>
      <div className="admin-registration__edit">
        <label htmlFor={`status-${registration.id}`}>處理狀態</label>
        <select id={`status-${registration.id}`} value={status} onChange={(event) => setStatus(event.target.value as RegistrationStatus)}>
          {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <label htmlFor={`note-${registration.id}`}>內部備註</label>
        <textarea id={`note-${registration.id}`} rows={3} maxLength={2000} value={adminNote} onChange={(event) => setAdminNote(event.target.value)} />
        <div><button className="button button--dark" type="button" onClick={save} disabled={saving}>{saving ? '儲存中…' : '儲存處理紀錄'}</button><span role="status">{message}</span></div>
      </div>
    </article>
  );
}

export function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadRegistrations = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/registrations');
      const result = await responseJson(response);
      if (!response.ok) throw new Error(result.error || '無法讀取報名資料。');
      setRegistrations(result.registrations || []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '無法讀取報名資料。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch('/api/admin/me').then((response) => {
      if (response.ok) {
        setAuthenticated(true);
        void loadRegistrations();
      }
    }).catch(() => setError('本機 API 尚未啟動，請啟動完整開發服務。')).finally(() => setChecking(false));
  }, []);

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: form.get('password') }),
      });
      const result = await responseJson(response);
      if (!response.ok) throw new Error(result.error || '登入失敗。');
      setAuthenticated(true);
      void loadRegistrations();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '登入失敗。');
    }
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => undefined);
    setAuthenticated(false);
    setRegistrations([]);
  };

  return (
    <section className="admin-page container">
      <div className="admin-page__heading"><Eyebrow showDot>ADMIN CONSOLE</Eyebrow><h1>管理者後台</h1><p>檢視與處理 CIP 課程報名申請。本地版本的資料保存在這台電腦。</p></div>
      {checking ? <p>確認登入狀態中…</p> : authenticated ? <>
        <div className="admin-toolbar"><div><h2>報名申請</h2><p>共 {registrations.length} 筆，依送出時間排序。</p></div><div><button className="button button--light" type="button" onClick={loadRegistrations} disabled={loading}>{loading ? '更新中…' : '重新整理'}</button><button className="button button--dark" type="button" onClick={logout}>登出</button></div></div>
        {error && <p className="admin-error" role="alert">{error}</p>}
        {registrations.length === 0 && !loading && !error && <div className="admin-empty">目前沒有報名申請。有人送出表單後，資料會出現在這裡。</div>}
        <div className="admin-registration-list">{registrations.map((registration) => <RegistrationCard registration={registration} key={registration.id} />)}</div>
      </> : <form className="admin-login" onSubmit={login}>
        <h2>管理者登入</h2><p>請輸入本機管理者密碼。</p>
        <label htmlFor="admin-password">密碼</label>
        <input id="admin-password" name="password" type="password" autoComplete="current-password" required />
        <button className="button button--dark" type="submit">登入後台 ↗</button>
        {error && <p className="admin-error" role="alert">{error}</p>}
      </form>}
    </section>
  );
}
