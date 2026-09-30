import { useEffect, useState } from 'react';
import { videoFor, youtubeEmbedUrl, type VideoEntry } from '../lib/videos';

function ImageSeq({ frames, alt }: { frames: string[]; alt: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (frames.length < 2) return;
    const id = setInterval(() => setI((x) => (x + 1) % frames.length), 900);
    return () => clearInterval(id);
  }, [frames.length]);
  return <img src={frames[i]} alt={alt} className="w-full h-full object-contain bg-black" loading="lazy" />;
}

export function VideoDemo({ exerciseId, name }: { exerciseId: string; name: string }) {
  const v: VideoEntry | undefined = videoFor(exerciseId);
  const [play, setPlay] = useState(false);
  const [fileFailed, setFileFailed] = useState(false);
  if (!v) return <div className="card2 p-3 text-sm muted">Sem demonstração cadastrada.</div>;

  const base = v.url ?? '';
  const src = base.startsWith('/') ? `${import.meta.env.BASE_URL}${base.slice(1)}` : base;

  return (
    <div className="mt-2">
      <div className="rounded-xl overflow-hidden bg-black" style={{ aspectRatio: '16 / 9' }}>
        {v.kind === 'youtube' && (
          play ? (
            <iframe
              title={`Demonstração: ${name}`}
              src={youtubeEmbedUrl(v)}
              className="w-full h-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <button className="w-full h-full relative" onClick={() => setPlay(true)} aria-label={`Ver demonstração de ${name}`}>
              <img
                src={v.poster ?? `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`}
                alt=""
                className="w-full h-full object-cover opacity-80"
                loading="lazy"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="rounded-full px-5 py-3 font-bold text-black" style={{ background: 'var(--accent)' }}>▶ Ver trecho{v.startSec != null ? ` (${fmt(v.startSec)}–${fmt(v.endSec ?? v.startSec + 30)})` : ''}</span>
              </span>
            </button>
          )
        )}
        {v.kind === 'file' && !fileFailed && (
          <video src={src} poster={v.poster} className="w-full h-full object-contain" controls playsInline muted loop preload="none" onError={() => setFileFailed(true)} />
        )}
        {v.kind === 'file' && fileFailed && (v.frames?.length ? <ImageSeq frames={v.frames} alt={name} /> : <div className="p-3 text-sm muted">O vídeo não tocou neste navegador.</div>)}
        {v.kind === 'image-seq' && <ImageSeq frames={v.frames ?? []} alt={name} />}
        {v.kind === 'svg' && <img src={src} alt={name} className="w-full h-full object-contain" />}
      </div>
      <div className="flex flex-wrap gap-2 mt-1 text-xs muted">
        <span>{v.source}</span>
        <span>·</span>
        <span>{v.license}</span>
        {v.quality === 'abaixo-do-ideal' && <span style={{ color: 'var(--warn)' }}>· abaixo do ideal</span>}
        {v.kind === 'youtube' && <span>· precisa de internet</span>}
      </div>
      {v.flags?.length ? <p className="text-xs mt-1" style={{ color: 'var(--warn)' }}>{v.flags.join(' ')}</p> : null}
    </div>
  );
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, '0')}`;
}
