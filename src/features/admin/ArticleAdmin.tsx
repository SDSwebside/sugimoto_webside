import { FormEvent, useEffect, useState } from 'react';
import type { Article } from '../journal/types';

async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  let result: T & { error?: string };
  try { result = await response.json() as T & { error?: string }; }
  catch { throw new Error('文章 API 未連線，請確認 PostgreSQL 與網站服務。'); }
  if (!response.ok) throw new Error(result.error || '操作失敗。');
  return result;
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = () => reject(new Error('無法讀取圖片。'));
    reader.readAsDataURL(file);
  });
}

export function ArticleAdmin() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [altText, setAltText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const selected = articles.find((article) => article.id === selectedId);

  const refresh = async () => {
    const result = await api<{ articles: Article[] }>('/api/admin/articles');
    setArticles(result.articles);
  };

  useEffect(() => { void refresh().catch((cause) => setError(cause.message)); }, []);

  const select = (article: Article | null) => {
    setSelectedId(article?.id || null);
    setTitle(article?.title || '');
    setSummary(article?.summary || '');
    setBody(article?.body || '');
    setImage(null);
    setAltText('');
    setError('');
    setMessage('');
  };

  const save = async (status: 'draft' | 'published') => {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const payload = { title, summary, body, status };
      let result: { article: Article };
      if (selectedId) {
        result = await api(`/api/admin/articles/${selectedId}`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
      } else {
        result = await api('/api/admin/articles', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
        if (status === 'published') {
          result = await api(`/api/admin/articles/${result.article.id}`, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
          });
        }
      }
      setSelectedId(result.article.id);
      await refresh();
      setMessage(status === 'published' ? '文章已發布。' : '草稿已儲存。');
    } catch (cause) { setError(cause instanceof Error ? cause.message : '儲存失敗。'); }
    finally { setBusy(false); }
  };

  const upload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedId || !image) return;
    const fileInput = event.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      if (image.size > 5 * 1024 * 1024) throw new Error('圖片需小於 5 MB。');
      await api(`/api/admin/articles/${selectedId}/images`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: await toBase64(image), altText }),
      });
      await refresh();
      setImage(null);
      setAltText('');
      fileInput.value = '';
      setMessage('圖片已存入資料庫。');
    } catch (cause) { setError(cause instanceof Error ? cause.message : '圖片上傳失敗。'); }
    finally { setBusy(false); }
  };

  const removeImage = async (imageId: string) => {
    if (!selectedId || !window.confirm('確定移除這張圖片？')) return;
    setBusy(true);
    setError('');
    try {
      await api(`/api/admin/articles/${selectedId}/images/${imageId}`, { method: 'DELETE' });
      await refresh();
      setMessage('圖片已移除。');
    } catch (cause) { setError(cause instanceof Error ? cause.message : '無法移除圖片。'); }
    finally { setBusy(false); }
  };

  return <section className="article-admin" aria-label="文章管理">
    <div className="article-admin__sidebar"><div className="article-admin__sidebar-heading"><h2>文章</h2><button type="button" onClick={() => select(null)}>＋ 新增</button></div>
      {articles.length === 0 && <p>尚無文章，從新增開始。</p>}
      {articles.map((article) => <button className={selectedId === article.id ? 'is-selected' : ''} type="button" key={article.id} onClick={() => select(article)}><strong>{article.title}</strong><small>{article.status === 'published' ? '已發布' : '草稿'} · {new Date(article.updatedAt).toLocaleDateString('zh-TW')}</small></button>)}
    </div>
    <div className="article-admin__editor"><h2>{selectedId ? '編輯文章' : '新增文章'}</h2>
      <label htmlFor="article-title">標題</label><input id="article-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={160} required />
      <label htmlFor="article-summary">摘要</label><textarea id="article-summary" value={summary} onChange={(event) => setSummary(event.target.value)} maxLength={500} rows={3} />
      <label htmlFor="article-body">內文</label><textarea id="article-body" value={body} onChange={(event) => setBody(event.target.value)} maxLength={30000} rows={15} required placeholder="以空白行分段，發布後會顯示為文章段落。" />
      <div className="article-admin__actions"><button className="button button--light" type="button" disabled={busy || !title.trim() || !body.trim()} onClick={() => void save('draft')}>{selected?.status === 'published' ? '取消發布並存為草稿' : '儲存草稿'}</button><button className="button button--dark" type="button" disabled={busy || !title.trim() || !body.trim()} onClick={() => void save('published')}>{busy ? '處理中…' : '發布文章'}</button></div>
      {selectedId && <div className="article-admin__images"><h3>文章圖片</h3><p>PNG、JPEG、WebP；每張最多 5 MB，每篇最多 8 張。第一張會作為列表封面。</p>
        <div className="article-admin__image-list">{selected?.images.map((item) => <figure key={item.id}><img src={`/api/admin/images/${item.id}`} alt={item.altText} loading="lazy" /><figcaption>{item.altText || '未填寫圖片說明'}</figcaption><button type="button" disabled={busy} onClick={() => void removeImage(item.id)}>移除</button></figure>)}</div>
        <form onSubmit={(event) => void upload(event)}><label htmlFor="article-image">選擇圖片</label><input id="article-image" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setImage(event.target.files?.[0] || null)} /><label htmlFor="article-image-alt">圖片說明</label><input id="article-image-alt" value={altText} onChange={(event) => setAltText(event.target.value)} maxLength={200} placeholder="描述圖片內容，方便閱讀與無障礙使用" /><button className="button button--light" type="submit" disabled={busy || !image}>上傳圖片</button></form>
      </div>}
      {error && <p className="admin-error" role="alert">{error}</p>}
      {message && <p className="article-admin__message" role="status">{message}</p>}
    </div>
  </section>;
}
