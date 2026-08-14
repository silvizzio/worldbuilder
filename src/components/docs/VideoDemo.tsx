import { cn } from '@/components/utils/cn';
import { asset } from '@/lib/assets';

export function VideoDemo({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const videoSrc = asset(src);
  const posterSrc = poster ? asset(poster) : undefined;

  return (
    <div className={cn('not-prose overflow-hidden rounded-2xl border border-fd-border bg-black shadow-sm', className)}>
      <video
        className="h-full w-full"
        src={videoSrc}
        poster={posterSrc}
        muted
        playsInline
        loop
        autoPlay
        controls
        preload="metadata"
      />
    </div>
  );
}
