import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Download, ImagePlus, Loader2, Trash2, Layers } from 'lucide-react';
import { Pokemon } from '../types/pokemon';
import { openImageFromDisk, savePngDataUrl } from '../lib/imageBridge';

const MAX_CANVAS_WIDTH = 1200;
const DEFAULT_STICKER_WIDTH = 140;

export interface PlacedSticker {
  id: string;
  pokemonId: number;
  name: string;
  imageUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

function getStickerImageUrl(pokemon: Pokemon): string {
  const official = pokemon.sprites.other?.['official-artwork']?.front_default;
  return official || pokemon.sprites.front_default;
}

function getCanvasCoords(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
}

function hitTestStickers(
  stickers: PlacedSticker[],
  x: number,
  y: number
): PlacedSticker | null {
  for (let i = stickers.length - 1; i >= 0; i--) {
    const s = stickers[i];
    if (x >= s.x && x <= s.x + s.width && y >= s.y && y <= s.y + s.height) {
      return s;
    }
  }
  return null;
}

interface PhotoEditorProps {
  pokemon: Pokemon[];
  loading: boolean;
}

export default function PhotoEditor({ pokemon, loading }: PhotoEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const stickerImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());

  const [canvasSize, setCanvasSize] = useState<{ w: number; h: number } | null>(null);
  const [bgReady, setBgReady] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [stickers, setStickers] = useState<PlacedSticker[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [stickerQuery, setStickerQuery] = useState('');
  const [drag, setDrag] = useState<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const filteredPokemon = useMemo(() => {
    const q = stickerQuery.trim().toLowerCase();
    if (!q) return pokemon;
    return pokemon.filter((p) => p.name.toLowerCase().includes(q));
  }, [pokemon, stickerQuery]);

  const loadBackground = useCallback((dataUrl: string) => {
    stickerImagesRef.current.clear();
    setStickers([]);
    setSelectedId(null);
    setBgReady(false);
    bgImageRef.current = null;

    const img = new Image();
    img.onload = () => {
      const nw = img.naturalWidth;
      const nh = img.naturalHeight;
      let cw = nw;
      let ch = nh;
      if (nw > MAX_CANVAS_WIDTH) {
        cw = MAX_CANVAS_WIDTH;
        ch = (nh / nw) * MAX_CANVAS_WIDTH;
      }
      setCanvasSize({ w: Math.round(cw), h: Math.round(ch) });
      bgImageRef.current = img;
      setBgReady(true);
    };
    img.onerror = () => {
      setCanvasSize(null);
      setBgReady(false);
    };
    img.src = dataUrl;
  }, []);

  const handleImport = async () => {
    setImporting(true);
    try {
      const result = await openImageFromDisk();
      if (result?.dataUrl) {
        loadBackground(result.dataUrl);
      }
    } finally {
      setImporting(false);
    }
  };

  const addSticker = useCallback(
    (p: Pokemon) => {
      if (!canvasSize || !bgReady) return;

      const imageUrl = getStickerImageUrl(p);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const maxW = DEFAULT_STICKER_WIDTH;
        const w = Math.min(maxW, img.naturalWidth);
        const h = (img.naturalHeight / img.naturalWidth) * w;
        const id = crypto.randomUUID();
        const x = Math.max(0, (canvasSize.w - w) / 2);
        const y = Math.max(0, (canvasSize.h - h) / 2);

        stickerImagesRef.current.set(id, img);
        setStickers((prev) => [
          ...prev,
          {
            id,
            pokemonId: p.id,
            name: p.name,
            imageUrl,
            x,
            y,
            width: w,
            height: h,
          },
        ]);
        setSelectedId(id);
      };
      img.onerror = () => {
        /* sprite failed to load */
      };
      img.src = imageUrl;
    },
    [bgReady, canvasSize]
  );

  const removeSelected = () => {
    if (!selectedId) return;
    stickerImagesRef.current.delete(selectedId);
    setStickers((prev) => prev.filter((s) => s.id !== selectedId));
    setSelectedId(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId && document.activeElement?.tagName !== 'INPUT') {
          e.preventDefault();
          stickerImagesRef.current.delete(selectedId);
          setStickers((prev) => prev.filter((s) => s.id !== selectedId));
          setSelectedId(null);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvasSize || !bgReady || !bgImageRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { w, h } = canvasSize;
    canvas.width = w;
    canvas.height = h;

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(bgImageRef.current, 0, 0, w, h);

    for (const s of stickers) {
      const simg = stickerImagesRef.current.get(s.id);
      if (simg) {
        ctx.drawImage(simg, s.x, s.y, s.width, s.height);
      }
    }

    if (selectedId) {
      const s = stickers.find((x) => x.id === selectedId);
      if (s) {
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.95)';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 4]);
        ctx.strokeRect(s.x - 2, s.y - 2, s.width + 4, s.height + 4);
        ctx.setLineDash([]);
      }
    }
  }, [bgReady, canvasSize, stickers, selectedId]);

  const handleExport = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !bgReady) return;

    setExporting(true);
    try {
      const dataUrl = canvas.toDataURL('image/png');
      await savePngDataUrl(dataUrl);
    } catch {
      /* export blocked or failed */
    } finally {
      setExporting(false);
    }
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !canvasSize) return;

    const { x, y } = getCanvasCoords(canvas, e.clientX, e.clientY);
    const hit = hitTestStickers(stickers, x, y);

    if (hit) {
      setSelectedId(hit.id);
      setDrag({
        id: hit.id,
        offsetX: x - hit.x,
        offsetY: y - hit.y,
      });
      canvas.setPointerCapture(e.pointerId);
    } else {
      setSelectedId(null);
      setDrag(null);
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drag || !canvasSize) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getCanvasCoords(canvas, e.clientX, e.clientY);
    let nx = x - drag.offsetX;
    let ny = y - drag.offsetY;

    setStickers((prev) => {
      const s = prev.find((p) => p.id === drag.id);
      if (!s) return prev;
      nx = Math.max(0, Math.min(nx, canvasSize.w - s.width));
      ny = Math.max(0, Math.min(ny, canvasSize.h - s.height));
      return prev.map((p) => (p.id === drag.id ? { ...p, x: nx, y: ny } : p));
    });
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas?.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }
    setDrag(null);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 space-y-4 lg:w-80">
          <div className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/60">
            <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-bold text-ink-900 dark:text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30">
                <Layers className="h-4 w-4" />
              </span>
              Stickers
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-ink-600 dark:text-ink-400">
              Import a photo first, then add Pokémon. Drag stickers on the canvas to position them.
            </p>
            <input
              type="search"
              placeholder="Search Pokémon…"
              value={stickerQuery}
              onChange={(e) => setStickerQuery(e.target.value)}
              disabled={!bgReady}
              className="mb-4 w-full rounded-2xl border border-ink-200/80 bg-white/90 px-4 py-2.5 text-sm text-ink-900 shadow-inner placeholder:text-ink-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/25 disabled:opacity-50 dark:border-white/10 dark:bg-ink-950/50 dark:text-ink-100"
            />
            <div className="max-h-[min(420px,50vh)] space-y-1 overflow-y-auto pr-1">
              {loading && (
                <div className="flex items-center justify-center py-10 text-violet-600 dark:text-cyan-400">
                  <Loader2 className="h-9 w-9 animate-spin" />
                </div>
              )}
              {!loading &&
                filteredPokemon.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    disabled={!bgReady}
                    onClick={() => addSticker(p)}
                    className="flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left transition hover:bg-violet-50/90 disabled:pointer-events-none disabled:opacity-40 dark:hover:bg-ink-800/80"
                  >
                    <img
                      src={getStickerImageUrl(p)}
                      alt=""
                      className="h-11 w-11 shrink-0 object-contain"
                    />
                    <span className="truncate font-medium capitalize text-ink-800 dark:text-ink-100">
                      {p.name}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleImport}
              disabled={importing}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110 disabled:opacity-60"
            >
              {importing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ImagePlus className="h-5 w-5" />
              )}
              Import image
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={!bgReady || exporting}
              className="inline-flex items-center gap-2 rounded-2xl border border-cyan-200/80 bg-gradient-to-r from-cyan-500 to-teal-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:brightness-110 disabled:opacity-45"
            >
              {exporting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Download className="h-5 w-5" />
              )}
              Export PNG
            </button>
            {selectedId && (
              <button
                type="button"
                onClick={removeSelected}
                className="inline-flex items-center gap-2 rounded-2xl border border-rose-300/80 bg-rose-50/90 px-4 py-2.5 font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-950/50 dark:text-rose-300 dark:hover:bg-rose-950/80"
              >
                <Trash2 className="h-5 w-5" />
                Remove sticker
              </button>
            )}
          </div>

          <div className="flex min-h-[320px] items-start justify-center rounded-3xl border border-white/60 bg-white/50 p-6 shadow-inner backdrop-blur dark:border-white/10 dark:bg-ink-950/40">
            {!canvasSize && (
              <p className="max-w-md text-balance px-4 py-12 text-center text-sm leading-relaxed text-ink-600 dark:text-ink-400">
                Use <strong className="text-ink-800 dark:text-ink-200">Import image</strong> to load a photo.
                In the desktop app, Electron opens a file dialog and reads the file in the main process.
              </p>
            )}
            {canvasSize && (
              <canvas
                ref={canvasRef}
                className="max-h-[70vh] max-w-full cursor-grab rounded-2xl bg-white shadow-glass-lg active:cursor-grabbing"
                style={{ touchAction: 'none' }}
                width={canvasSize.w}
                height={canvasSize.h}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
