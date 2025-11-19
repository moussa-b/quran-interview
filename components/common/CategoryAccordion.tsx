'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { CategoryWithTranslations, SubcategoryWithTranslations } from '@/lib/api/services/types';

interface CategoryWithSubcategories extends CategoryWithTranslations {
  subcategories: SubcategoryWithTranslations[];
}

interface CategoryAccordionProps {
  categories: CategoryWithSubcategories[];
  locale: string;
}

export function CategoryAccordion({ categories, locale }: CategoryAccordionProps) {
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
        No categories available
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {categories.map((category) => {
        const categoryTranslation = category.translations.find(
          (t) => t.language_code === locale
        ) || category.translations[0];

        return (
          <AccordionItem key={category.id} value={category.id.toString()}>
            <AccordionTrigger className="hover:no-underline">
              <div className="text-left">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {categoryTranslation?.label || category.slug}
                </h3>
                {categoryTranslation?.description && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    {categoryTranslation.description}
                  </p>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {category.subcategories && category.subcategories.length > 0 ? (
                <ul className="space-y-3 mt-2">
                  {category.subcategories.map((subcategory) => {
                    const subcategoryTranslation = subcategory.translations.find(
                      (t) => t.language_code === locale
                    ) || subcategory.translations[0];

                    return (
                      <li
                        key={subcategory.id}
                        className="border-l-2 border-zinc-200 dark:border-zinc-700 pl-4 py-2"
                      >
                        <span className="font-medium text-zinc-900 dark:text-white">
                          {subcategoryTranslation?.label || subcategory.slug}
                        </span>
                        {subcategoryTranslation?.description && (
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                            {subcategoryTranslation.description}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
                  No subcategories available
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

