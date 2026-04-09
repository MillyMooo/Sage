import { useEffect, useState } from 'react';

let showToastFn: ((msg: string) => void) | null = null;

export function showMessage(msg: string) {
  showToastFn?.(msg);
}

export default function Toast() {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    showToastFn = (msg) => {
      setMessage(msg);
      setVisible(true);
      setTimeout(() => setVisible(false), 2500);
    };
    return () => { showToastFn = null; };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-6 right-6 bg-primary text-primary-foreground rounded-pill px-6 py-3 text-sm font-bold shadow-card-lg z-[1000] toast-anim">
      ✓ {message}
    </div>
  );
}
