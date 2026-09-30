export interface VideoEntry {
  id: string;
  kind: 'youtube' | 'file' | 'image-seq' | 'svg';
  url?: string;
  youtubeId?: string;
  startSec?: number;
  endSec?: number;
  poster?: string;
  frames?: string[];
  source: string;
  license: string;
  quality: 'ok' | 'abaixo-do-ideal';
  reason: string;
  flags?: string[];
}

// Carrega todos os JSONs de src/data/videos/*.json (fonte única dos vídeos)
const modules = import.meta.glob('../data/videos/*.json', { eager: true }) as Record<string, { default: VideoEntry[] }>;

export const videos: Record<string, VideoEntry> = {};
for (const m of Object.values(modules)) {
  for (const v of m.default ?? []) videos[v.id] = v;
}

export function videoFor(id: string): VideoEntry | undefined {
  return videos[id];
}

export function youtubeEmbedUrl(v: VideoEntry): string {
  const id = v.youtubeId ?? (v.url?.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)?.[1] ?? '');
  const p = new URLSearchParams({ rel: '0', modestbranding: '1', playsinline: '1', autoplay: '1', mute: '1' });
  if (v.startSec != null) p.set('start', String(Math.floor(v.startSec)));
  if (v.endSec != null) p.set('end', String(Math.ceil(v.endSec)));
  return `https://www.youtube-nocookie.com/embed/${id}?${p.toString()}`;
}
