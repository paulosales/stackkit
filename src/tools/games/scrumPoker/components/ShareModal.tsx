import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, X, QrCode, Smartphone, Globe, Settings } from 'lucide-react';

interface ShareModalProps {
  roomCode: string;
  onClose: () => void;
  t: (key: string, options?: any) => string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ roomCode, onClose, t }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [customHost, setCustomHost] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Compute player join URL
  const baseUrl = customHost.trim() || (typeof window !== 'undefined' ? window.location.origin : '');
  const pathname = typeof window !== 'undefined' ? window.location.pathname || '' : '/scrum-poker';
  let toolBasePath = '/scrum-poker';
  if (pathname.includes('scrum-poker') || pathname.includes('planning-poker')) {
    toolBasePath = pathname.split('?')[0];
  } else if (pathname.startsWith('/pt')) {
    toolBasePath = '/pt/scrum-poker';
  } else if (pathname.startsWith('/es')) {
    toolBasePath = '/es/scrum-poker';
  } else if (pathname.startsWith('/en')) {
    toolBasePath = '/en/scrum-poker';
  }

  const joinUrl = `${baseUrl.replace(/\/$/, '')}${toolBasePath}?role=voter&room=${roomCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="sp-modal-backdrop animate-fadeIn">
      <div className="sp-modal-box max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-cyan-400 flex items-center justify-center mx-auto mb-3">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {t('tools.scrumPoker.share.title', { defaultValue: 'Invite Your Team' })}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('tools.scrumPoker.share.subtitle', {
              defaultValue: 'Scan with phone camera or share the direct link to join instantly.',
            })}
          </p>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 mb-6">
          <div className="p-3 bg-white rounded-lg shadow-md">
            <QRCodeSVG value={joinUrl} size={180} level="M" />
          </div>
          <span className="text-[11px] text-slate-500 mt-2 flex items-center">
            <Smartphone className="w-3 h-3 mr-1" />
            {t('tools.scrumPoker.share.scanTip', { defaultValue: 'Open phone camera to scan' })}
          </span>
        </div>

        {/* Room Code Banner */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            {t('tools.scrumPoker.roomCodeLabel', { defaultValue: 'Room Code' })}
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 font-mono font-black text-xl tracking-widest text-indigo-600 dark:text-cyan-400 text-center border border-slate-200 dark:border-slate-700">
              {roomCode}
            </div>
            <button
              type="button"
              onClick={handleCopyCode}
              className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition flex items-center space-x-1"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Direct Link */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            {t('tools.scrumPoker.share.directLink', { defaultValue: 'Direct Join Link' })}
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={joinUrl}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 truncate"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center space-x-1 flex-shrink-0"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Local Network / Custom Host Accordion */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center space-x-1"
          >
            <Settings className="w-3 h-3" />
            <span>{t('tools.scrumPoker.share.advancedSettings', { defaultValue: 'Local Wi-Fi / Custom Host IP' })}</span>
          </button>
          {showAdvanced && (
            <div className="mt-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
              <p className="text-[11px] text-slate-500 mb-2">
                If testing on local devices with localhost, enter your machine local LAN IP (e.g. http://192.168.1.100:5174).
              </p>
              <input
                type="text"
                value={customHost}
                onChange={(e) => setCustomHost(e.target.value)}
                placeholder="http://192.168.1.X:5174"
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

