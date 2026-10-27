interface LineQrProps {
  className?: string;
}

export function LineQr({ className = '' }: LineQrProps) {
  return <img className={className} src="/assets/line-official-qr.png" alt="杉鼎森 LINE 官方帳號加好友 QR Code" width="678" height="681" loading="lazy" />;
}
