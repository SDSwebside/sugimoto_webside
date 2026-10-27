import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Article } from './types';

export function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/articles/${id}`, { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json() as { article?: Article; error?: string };
        if (!response.ok || !result.article) throw new Error(result.error || '找不到文章。');
        setArticle(result.article);
      })
      .catch((cause) => { if (cause.name !== 'AbortError') setError(cause.message || '無法載入文章。'); });
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (article) {
      document.title = `${article.title}｜杉鼎森數位工程`;
      document.querySelector('meta[name="description"]')?.setAttribute('content', article.summary || article.title);
    }
  }, [article]);

  return <article className="journal-detail container">
    <Link className="back-link" to="/journal">← 返回工程師的心內話</Link>
    {error && <p role="alert">{error}</p>}
    {!article && !error && <p role="status">載入文章中…</p>}
    {article && <>
      <header><span className="eyebrow">ENGINEERING JOURNAL</span><h1>{article.title}</h1><time dateTime={article.publishedAt || undefined}>{article.publishedAt && new Date(article.publishedAt).toLocaleDateString('zh-TW')}</time><p>{article.summary}</p></header>
      <div className="journal-detail__body">{article.body.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
      {article.images.length > 0 && <div className="journal-detail__images">{article.images.map((image) => <figure key={image.id}><img src={`/api/images/${image.id}`} alt={image.altText} loading="lazy" />{image.altText && <figcaption>{image.altText}</figcaption>}</figure>)}</div>}
    </>}
  </article>;
}
