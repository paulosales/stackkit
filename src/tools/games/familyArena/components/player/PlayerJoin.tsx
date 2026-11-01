import React, { useState, useRef } from 'react';
import { Gamepad2, AlertCircle, RotateCcw, Camera, Image as ImageIcon, X } from 'lucide-react';
import { useTranslation } from '../../i18n/I18nContext';
import { processAvatarImage, isImageAvatar } from '../../utils/imageUtils';
import { AvatarDisplay } from '../common/AvatarDisplay';

interface PlayerJoinProps {
  initialRoomCode?: string;
  onJoin: (roomCode: string, name: string, avatar: string) => void;
  isConnecting: boolean;
  error: string | null;
  onCancel?: () => void;
}

const EMOJI_AVATARS = [
  '🐶', '🦊', '🐼', '🦁', '🐯', '🚀', '⚡', '🍕',
  '🍩', '🎮', '🕹️', '🦄', '🦖', '🏆', '💎', '🥑'
];

export const PlayerJoin: React.FC<PlayerJoinProps> = ({
  initialRoomCode = '',
  onJoin,
  isConnecting,
  error,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [roomCode, setRoomCode] = useState(initialRoomCode.toUpperCase());
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🚀');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingPhoto(true);
      const compressedDataUrl = await processAvatarImage(file);
      setSelectedAvatar(compressedDataUrl);
      setValidationError(null);
    } catch (err: any) {
      setValidationError(err.message || t('photoProcessError'));
    } finally {
      setIsProcessingPhoto(false);
      e.target.value = ''; // Reset input for reuse
    }
  };

  const handleResetToEmoji = () => {
    setSelectedAvatar('🚀');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRoom = roomCode.trim().toUpperCase();
    const cleanName = name.trim().slice(0, 24);

    if (!cleanRoom) {
      setValidationError(t('roomCodeLabel'));
      return;
    }
    if (!cleanName) {
      setValidationError(t('nicknameLabel'));
      return;
    }
    setValidationError(null);
    onJoin(cleanRoom, cleanName, selectedAvatar);
  };

  const isCustomPhoto = isImageAvatar(selectedAvatar);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 flex flex-col justify-center min-h-[80vh]">
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur transition-colors">
        {/* Header with avatar preview */}
        <div className="text-center mb-6">
          <div className="relative w-20 h-20 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/10 overflow-hidden">
            <AvatarDisplay
              avatar={selectedAvatar}
              name={name || 'Player'}
              sizeClass="w-full h-full"
              textClass="text-4xl"
            />
            {isCustomPhoto && (
              <button
                type="button"
                onClick={handleResetToEmoji}
                className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition"
                title={t('removePhoto')}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('joinGameTitle')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('chooseAvatarHeading')}
          </p>
        </div>

        {/* Error message */}
        {(error || validationError) && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-500/50 text-red-800 dark:text-red-200 text-xs flex flex-col gap-1.5">
            <div className="flex items-center space-x-2 font-bold text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{t('confirm')}</span>
            </div>
            <p className="leading-relaxed">{validationError || error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Room Code */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t('roomCodeLabel')}
            </label>
            <input
              type="text"
              placeholder={t('roomCodePlaceholder')}
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={6}
              disabled={isConnecting}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-base text-center font-mono font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Nickname */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t('nicknameLabel')}
            </label>
            <input
              type="text"
              placeholder={t('nicknamePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={24}
              disabled={isConnecting}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Avatar Selector Section: Camera, Gallery & Emojis */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t('chooseAvatarHeading')}
              </label>

              {/* Hidden file inputs for Camera & Gallery */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  disabled={isProcessingPhoto}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold flex items-center space-x-1 transition"
                  title={t('takePhotoBtn')}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{t('takePhotoBtn')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  disabled={isProcessingPhoto}
                  className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold flex items-center space-x-1 transition"
                  title={t('galleryPhotoBtn')}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{t('galleryPhotoBtn')}</span>
                </button>
              </div>
            </div>

            {/* Emoji Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {EMOJI_AVATARS.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`text-2xl p-2 rounded-xl transition-transform active:scale-90 flex items-center justify-center border ${
                    selectedAvatar === avatar
                      ? 'bg-emerald-500/20 border-emerald-500 scale-110 shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-750'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isConnecting || isProcessingPhoto}
            className={`w-full py-4 rounded-xl font-bold text-base shadow-xl transition active:scale-95 flex items-center justify-center space-x-2 mt-4 ${
              isConnecting || isProcessingPhoto
                ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/30'
            }`}
          >
            {isConnecting ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t('connectingToDisplay')}</span>
              </span>
            ) : (
              <>
                <Gamepad2 className="w-5 h-5" />
                <span>{t('joinGameBtn')}</span>
              </>
            )}
          </button>

          {/* Cancel button if stuck connecting */}
          {isConnecting && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2.5 rounded-xl font-semibold text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/50 flex items-center justify-center space-x-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('cancelJoin')}</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
