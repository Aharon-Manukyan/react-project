import { CoverTone } from "@/lib/types";
import { ProjectGallery } from "@/components/project-gallery";

const tones: Record<CoverTone, string> = {
  ember: "from-[#5a2b1f] via-[#d97757] to-[#f0c7a4]",
  sage: "from-[#1d3324] via-[#7f9a82] to-[#d5e3d2]",
  ink: "from-[#1a1714] via-[#3d3832] to-[#c4a574]",
  sand: "from-[#3b2f22] via-[#c4a574] to-[#f4efe6]",
};

export function Cover({
  tone,
  title,
  pictures = [],
  gallery = false,
}: {
  tone: string;
  title: string;
  pictures?: string[];
  gallery?: boolean;
}) {
  // Страница проекта: полная карусель
  if (gallery && pictures.length > 0) {
    return <ProjectGallery pictures={pictures} title={title} />;
  }

  // Карточки: первое фото как обложка
  if (pictures.length > 0) {
    return (
      <div className="relative isolate min-h-44 overflow-hidden rounded-[1.5rem]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <ProjectGallery pictures={pictures} title={title} />
      </div>
    );
  }

  const gradient = tones[tone as CoverTone] ?? tones.ember;
  return (
    <div
      className={`relative isolate overflow-hidden rounded-[1.5rem] bg-linear-to-br ${gradient} min-h-44`}
    >
      <div className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:18px_18px] opacity-30" />
      <p className="absolute right-4 bottom-4 left-4 font-serif text-2xl leading-none tracking-tight text-white/90">
        {title}
      </p>
    </div>
  );
}
