import React from "react";

type GuideCategoryFilterProps = {
  categories: string[];
  selectedCategories: string[];
  onChange: (next: string[]) => void;
};

export const GuideCategoryFilter: React.FC<GuideCategoryFilterProps> = ({
  categories,
  selectedCategories,
  onChange,
}) => {
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onChange(selectedCategories.filter((c) => c !== category));
    } else {
      onChange([...selectedCategories, category]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = selectedCategories.includes(category);

        return (
          <button
            key={category}
            type="button"
            onClick={() => toggleCategory(category)}
            className={`
              rounded-full px-4 py-1.5 text-sm font-medium transition
              border
              ${isActive
                ? "bg-GGP-darkGold text-GGP-dark border-GGP-darkGold dark:bg-GGP-lightGold dark:text-GGP-dark"
                : "bg-white text-GGP-dark border-GGP-darkGold/30 hover:bg-GGP-lightWight dark:bg-white/10 dark:text-white dark:border-GGP-darkGold/30 dark:hover:bg-white/20"
              }
            `}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};
