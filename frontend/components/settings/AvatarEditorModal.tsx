"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Image as ImageIcon, RotateCw, X, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AvatarEditorModalProps {
  src: string; // исходное изображение (data URL)
  busy?: boolean; // идёт загрузка на сервер
  onCancel: () => void;
  onSubmit: (dataUrl: string) => void; // отдаёт готовый квадрат 256×256 (JPEG)
}

const OUTPUT_SIZE = 256; // размер итогового квадрата, который уходит на бэк
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

type Offset = { x: number; y: number };

export function AvatarEditorModal({ src, busy = false, onCancel, onSubmit }: AvatarEditorModalProps) {
  const { t } = useTranslation();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; from: Offset } | null>(null);

  const [ready, setReady] = useState(false);
  const [viewport, setViewport] = useState(320); // сторона квадратной области редактирования (CSS px)
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // 0 | 90 | 180 | 270
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });

  // Подбираем размер области под ширину экрана (модалка не должна вылезать).
  useEffect(() => {
    const compute = () => setViewport(Math.min(320, window.innerWidth - 80));
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  // Загружаем картинку.
  useEffect(() => {
    setReady(false);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
      setReady(true);
    };
    img.src = src;
  }, [src]);

  // Минимальный масштаб, при котором повёрнутая картинка полностью накрывает квадрат.
  const coverScale = useCallback(() => {
    const img = imgRef.current;
    if (!img) return 1;
    return viewport / Math.min(img.naturalWidth, img.naturalHeight);
  }, [viewport]);

  // Ограничиваем сдвиг, чтобы за краями круга никогда не было пустоты.
  const clamp = useCallback(
    (off: Offset, z: number, rot: number): Offset => {
      const img = imgRef.current;
      if (!img) return off;
      const scale = coverScale() * z;
      const horizontal = rot % 180 === 0 ? img.naturalWidth : img.naturalHeight;
      const vertical = rot % 180 === 0 ? img.naturalHeight : img.naturalWidth;
      const maxX = Math.max(0, (horizontal * scale - viewport) / 2);
      const maxY = Math.max(0, (vertical * scale - viewport) / 2);
      return {
        x: Math.min(maxX, Math.max(-maxX, off.x)),
        y: Math.min(maxY, Math.max(-maxY, off.y)),
      };
    },
    [coverScale, viewport]
  );

  // Перерисовка превью.
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!ready || !canvas || !img) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = viewport * dpr;
    canvas.height = viewport * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, viewport, viewport);

    const off = clamp(offset, zoom, rotation);
    const scale = coverScale() * zoom;

    ctx.save();
    ctx.translate(viewport / 2 + off.x, viewport / 2 + off.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    ctx.restore();
  }, [ready, viewport, zoom, rotation, offset, clamp, coverScale]);

  // При смене зума/поворота подтягиваем сдвиг в допустимые границы.
  useEffect(() => {
    if (!ready) return;
    setOffset((o) => clamp(o, zoom, rotation));
  }, [zoom, rotation, ready, clamp]);

  // --- Перетаскивание ---
  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (busy) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, from: offset };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const next = {
      x: drag.from.x + (e.clientX - drag.startX),
      y: drag.from.y + (e.clientY - drag.startY),
    };
    setOffset(clamp(next, zoom, rotation));
  };
  const endDrag = (e: React.PointerEvent<HTMLCanvasElement>) => {
    dragRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const reset = () => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  };

  // Рендер итогового квадрата в тех же координатах, что и превью.
  const handleSubmit = () => {
    const img = imgRef.current;
    if (!img) return;

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const k = OUTPUT_SIZE / viewport;
    const off = clamp(offset, zoom, rotation);
    const scale = coverScale() * zoom * k;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    ctx.save();
    ctx.translate(OUTPUT_SIZE / 2 + off.x * k, OUTPUT_SIZE / 2 + off.y * k);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    ctx.restore();

    onSubmit(canvas.toDataURL("image/jpeg", 0.85));
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#131416] w-full max-w-md rounded-2xl shadow-2xl border border-slate-300 dark:border-slate-800 flex flex-col">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold">{t("settings.avatar.editTitle")}</h3>
          <button
            onClick={onCancel}
            disabled={busy}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Область редактирования */}
        <div className="p-5 flex flex-col items-center gap-5">
          <div className="relative" style={{ width: viewport, height: viewport }}>
            <canvas
              ref={canvasRef}
              style={{ width: viewport, height: viewport }}
              className="rounded-xl bg-slate-100 dark:bg-slate-900 touch-none cursor-grab active:cursor-grabbing"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            />
            {/* Круглая маска: затемняет всё за пределами круга + тонкое кольцо */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 ring-white/70"
                style={{
                  width: viewport,
                  height: viewport,
                  boxShadow: "0 0 0 9999px rgba(0,0,0,0.45)",
                }}
              />
            </div>
            {!ready && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="animate-spin text-slate-400" size={28} />
              </div>
            )}
          </div>

          {/* Зум + поворот */}
          <div className="w-full flex items-center gap-3">
            <ImageIcon size={16} className="text-slate-400 shrink-0" />
            <input
              type="range"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={0.01}
              value={zoom}
              disabled={busy || !ready}
              onChange={(e) => setZoom(Number(e.target.value))}
              aria-label={t("settings.avatar.zoom")}
              className="flex-1 accent-blue-600 cursor-pointer"
            />
            <ImageIcon size={22} className="text-slate-400 shrink-0" />
            <button
              type="button"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              disabled={busy || !ready}
              title={t("settings.avatar.rotate")}
              aria-label={t("settings.avatar.rotate")}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 shrink-0"
            >
              <RotateCw size={18} />
            </button>
          </div>
        </div>

        {/* Действия */}
        <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={reset}
            disabled={busy || !ready}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            {t("settings.avatar.reset")}
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={busy}
              className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {t("common.cancel")}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={busy || !ready}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
            >
              {busy && <Loader2 size={16} className="animate-spin" />}
              {t("settings.avatar.submit")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
