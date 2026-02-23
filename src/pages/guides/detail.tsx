import React from "react";
import { Link, useParams } from "react-router-dom";
import { GuidePage } from "@/components/guides/guidePage";
import { Guide, guides } from "@/components/guides/guidesData";
import { chapterAdminGuides, divisionalAdminGuides } from "@/components/guides/adminGuidesData";

const getGuideBySlug = (slug: string, guides: Guide[]) => guides.find((g) => g.slug === slug);

export const GuideDetailRoute: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const adminGuides = [...chapterAdminGuides, ...divisionalAdminGuides];
  const guide = slug ? getGuideBySlug(slug, [...guides, ...adminGuides]) : undefined;

  if (!guide) {
    return (
      <div className="min-h-screen bg-GGP-lightWight text-GGP-dark dark:bg-GGP-dark dark:text-white">
        <div className="mx-auto w-full max-w-3xl px-4 py-10">
          <div className="rounded-2xl border border-GGP-darkGold/25 bg-white p-6 shadow-sm dark:border-GGP-darkGold/30 dark:bg-white/5 dark:shadow-none">
            <h1 className="text-xl font-semibold">Guide not found</h1>
            <p className="mt-2 text-sm text-GGP-dark/70 dark:text-white/75">
              The guide you are looking for does not exist or has been moved.
            </p>

            <Link
              to="/guides"
              className="mt-4 inline-flex rounded-lg border border-GGP-darkGold/30 bg-GGP-lightWight px-3 py-2 text-sm font-medium text-GGP-dark hover:bg-GGP-lightWight/70 dark:border-GGP-darkGold/35 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Back to guides
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-GGP-dark  dark:text-white">
      <div className="mx-auto w-full max-w-4xl px-4 pt-6">
        <Link
          to="/guides"
          className="inline-flex items-center gap-2 text-sm font-medium text-GGP-darkGold hover:opacity-90 dark:text-GGP-lightGold"
        >
          <span aria-hidden="true">←</span>
          Back to guides
        </Link>
      </div>

      <GuidePage title={guide.title} intro={guide.intro} videoUrl={guide.videoUrl}>
        {guide.content}
      </GuidePage>
    </div>
  );
};
