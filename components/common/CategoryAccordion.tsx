'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SubcategoryAccordion } from './SubcategoryAccordion';
import { QuranReferenceBadge } from './QuranReferenceBadge';
import type { 
  CategoryWithTranslations, 
  SubcategoryWithTranslations,
  ItemWithDetails 
} from '@/lib/api/services/types';

interface SubcategoryWithItems extends SubcategoryWithTranslations {
  items: ItemWithDetails[];
}

interface CategoryWithSubcategoriesAndItems extends CategoryWithTranslations {
  subcategories: SubcategoryWithItems[];
  items: ItemWithDetails[];
}

interface CategoryAccordionProps {
  categories: CategoryWithSubcategoriesAndItems[];
  locale: string;
  dictionary: {
    topics: {
      item: string;
      items: string;
      noItemsAvailable: string;
    };
  };
}

export function CategoryAccordion({ categories, locale, dictionary }: CategoryAccordionProps) {
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
        {dictionary.topics.noItemsAvailable}
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
              <div className="space-y-6 mt-2">
                {/* Items directly under category */}
                {category.items && category.items.length > 0 && (
                  <div className="space-y-3">
                    {category.items.map((item) => {
                      const itemTranslation = item.translations.find(
                        (t) => t.language_code === locale
                      ) || item.translations[0];

                      return (
                        <div
                          key={item.id}
                          className="border-l-2 border-blue-400 dark:border-blue-600 pl-4 py-2 bg-blue-50/50 dark:bg-blue-950/20 rounded-r"
                        >
                          <div className="font-medium text-zinc-900 dark:text-white">
                            {itemTranslation?.label || item.slug}
                          </div>
                          {itemTranslation?.description && (
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                              {itemTranslation.description}
                            </p>
                          )}
                          {item.quran_refs && item.quran_refs.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {item.quran_refs.map((ref) => (
                                <QuranReferenceBadge 
                                  key={ref.id}
                                  reference={ref}
                                  variant="blue"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Subcategories with their items (nested accordion) */}
                {category.subcategories && category.subcategories.length > 0 ? (
                  <SubcategoryAccordion 
                    subcategories={category.subcategories}
                    locale={locale}
                    dictionary={dictionary}
                  />
                ) : category.items.length === 0 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
                    {dictionary.topics.noItemsAvailable}
                  </p>
                ) : null}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

