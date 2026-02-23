import React from "react";

type GuidePageProps = {
  title: string;
  intro: string;
  videoUrl?: string;
  children: React.ReactNode;
};

const getEmbeddableVideoUrl = (url: string): string => {
  try {
    const u = new URL(url);

    if (u.hostname.includes("drive.google.com")) {
      const pathParts = u.pathname.split("/").filter(Boolean);

      const fileIndex = pathParts.indexOf("file");
      if (fileIndex !== -1 && pathParts[fileIndex + 1] === "d" && pathParts[fileIndex + 2]) {
        const fileId = pathParts[fileIndex + 2];
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }

      const openId = u.searchParams.get("id");
      if (openId) return `https://drive.google.com/file/d/${openId}/preview`;

      const ucId = u.searchParams.get("id");
      if (u.pathname.startsWith("/uc") && ucId) return `https://drive.google.com/file/d/${ucId}/preview`;
    }

    return url;
  } catch {
    return url;
  }
};

export const GuidePage: React.FC<GuidePageProps> = ({ title, intro, videoUrl, children }) => {
  const embedUrl = videoUrl ? getEmbeddableVideoUrl(videoUrl) : undefined;

  return (
    <div className="min-h-screen  text-GGP-dark dark:text-white">
      <div className="mx-auto w-full max-w-4xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm text-GGP-dark/70 dark:text-white/75 sm:text-base">{intro}</p>
          <div className="mt-4 h-1 w-24 rounded-full bg-GGP-darkGold" />
        </header>

        {embedUrl ? (
          <section className="mb-8">
            <div className="overflow-hidden rounded-2xl border border-GGP-darkGold/25 bg-white shadow-sm dark:border-GGP-darkGold/30 dark:bg-white/5 dark:shadow-none">
              <div className="aspect-video w-full bg-GGP-lightWight/60 dark:bg-black/30 min-h-96 ">
                <iframe
                  key={embedUrl}
                  className="h-full w-full"
                  src={embedUrl}
                  title={`${title} video`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="flex flex-col gap-2 border-t border-GGP-darkGold/20 p-4 dark:border-GGP-darkGold/25 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-GGP-dark/60 dark:text-white/65">
                  If the video does not load, click below to open it directly in a new tab or refer to the steps section below.
                </p>

                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-GGP-darkGold/30 bg-GGP-lightWight px-3 py-2 text-sm font-medium text-GGP-dark hover:bg-GGP-lightWight/70 dark:border-GGP-darkGold/35 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                >
                  Open video in new tab
                </a>
              </div>
            </div>
          </section>
        ) : null}

        <section className="rounded-2xl border border-GGP-darkGold/25 bg-white p-5 shadow-sm dark:border-GGP-darkGold/30 dark:bg-white/5 dark:shadow-none sm:p-6">
          <div
            className="
              prose max-w-none
              prose-headings:text-GGP-dark prose-p:text-GGP-dark/85 prose-li:text-GGP-dark/85
              prose-strong:text-GGP-dark prose-a:text-GGP-darkGold
              dark:prose-headings:text-white dark:prose-p:text-white/80 dark:prose-li:text-white/80
              dark:prose-strong:text-white dark:prose-a:text-GGP-lightGold
            "
          >
            {children}
          </div>
        </section>
      </div>
    </div>
  );
};
