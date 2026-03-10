import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { guides } from "@/components/guides/guidesData";
import { ContainerFluid } from "@/components/containerFluid";
import { GuideCategoryFilter } from "@/components/guides/guideCategoryFilter";
import { useAppSelector } from "@/redux/hooks";
import { chapterAdminGuides, divisionalAdminGuides } from "@/components/guides/adminGuidesData";

export const GuidesHome: React.FC = () => {
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const userDetails = useAppSelector((state) => state.auth.userDetails);
  const permission_type = userDetails.permission_type;
  const opsPermissionType = userDetails.ops_permission_type;
  const isAdmin = ["chapter", "division", "organisation"].includes(permission_type || "") || ["hos", "governor", "president"].includes(opsPermissionType || "");
  const divisionAdmin = ["division", "organisation"].includes(permission_type || "");

  const adminGuides = divisionAdmin ? [...chapterAdminGuides, ...divisionalAdminGuides] : chapterAdminGuides;
  const guidesToUse = isAdmin ? [...guides, ...adminGuides] : guides;

  const categories = useMemo(() => {
    return Array.from(new Set(guidesToUse.map((g) => g.category).filter((c): c is string => Boolean(c))));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return guidesToUse.filter((g) => {
      const matchesQuery = !q || g.title.toLowerCase().includes(q) || g.intro.toLowerCase().includes(q) || (g.category ?? "").toLowerCase().includes(q);

      const matchesCategory = selectedCategories.length === 0 || (g.category && selectedCategories.includes(g.category));

      return matchesQuery && matchesCategory;
    });
  }, [query, selectedCategories]);

  // bg-GGP-lightWight dark:bg-GGP-dark
  return (
    <ContainerFluid>
      <div className="min-h-screen  text-GGP-dark dark:text-white">
        <div className="mx-auto w-full max-w-5xl px-4 py-8">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">GGP Guides</h1>
            <p className="mt-2 max-w-3xl text-sm text-GGP-dark/70 dark:text-white/75 sm:text-base">
              Welcome to the GGP guide centre. Find a guide related to your concern and follow the steps to complete your task.
            </p>

            <div className="mt-4">
              <label className="sr-only" htmlFor="guide-search">
                Search guides
              </label>

              <div className="relative">
                <input
                  id="guide-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search guides (e.g., partners, payments)"
                  className="
                  w-full rounded-xl border border-GGP-darkGold/30 bg-white px-4 py-3 text-sm
                  text-GGP-dark placeholder:text-GGP-dark/50
                  outline-none ring-0
                  focus:border-GGP-darkGold focus:outline-none focus:ring-2 focus:ring-GGP-lightGold/40
                  dark:border-GGP-darkGold/35 dark:bg-white/10 dark:text-white dark:placeholder:text-white/50
                  dark:focus:ring-GGP-lightGold/25
                "
                />
              </div>
              <div className="mt-4">
                <GuideCategoryFilter categories={categories} selectedCategories={selectedCategories} onChange={setSelectedCategories} />
              </div>
            </div>

            <div className="mt-4 h-1 w-72 rounded-full bg-GGP-darkGold" />
          </header>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((g) => (
              <Link
                key={g.slug}
                to={`/guides/${g.slug}`}
                className="
                group rounded-2xl border border-GGP-darkGold/25 bg-white p-5 shadow-sm transition
                hover:-translate-y-0.5 hover:shadow-md
                dark:border-GGP-darkGold/30 dark:bg-white/5 dark:shadow-none dark:hover:bg-white/10
              "
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-GGP-dark group-hover:text-GGP-darkGold dark:text-white dark:group-hover:text-GGP-lightGold">
                      {g.title}
                    </h2>

                    {g.category ? <p className="mt-1 text-xs font-medium text-GGP-dark/55 dark:text-white/60">{g.category}</p> : null}
                  </div>

                  <span className="mt-1 text-GGP-darkGold dark:text-GGP-lightGold">→</span>
                </div>

                <p className="mt-3 text-sm text-GGP-dark/75 dark:text-white/75">{g.intro}</p>

                <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-GGP-darkGold dark:text-GGP-lightGold">
                  View guide <span className="transition group-hover:translate-x-0.5">›</span>
                </div>
              </Link>
            ))}
          </section>

          {filtered.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-GGP-darkGold/25 bg-white p-6 text-sm text-GGP-dark/70 dark:border-GGP-darkGold/30 dark:bg-white/5 dark:text-white/75">
              No guides match your search. Try a different keyword.
            </div>
          ) : null}
        </div>
      </div>
    </ContainerFluid>
  );
};
