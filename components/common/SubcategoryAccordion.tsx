'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ItemDetail } from './ItemDetail';
import type { 
  SubcategoryWithTranslations,
  ItemWithDetails 
} from '@/lib/api/services/types';

interface SubcategoryWithItems extends SubcategoryWithTranslations {
  items: ItemWithDetails[];
}

interface SubcategoryAccordionProps {
  subcategories: SubcategoryWithItems[];
  locale: string;
  dictionary: {
    topics: {
      item: string;
      items: string;
      noItemsAvailable: string;
    };
  };
}

export function SubcategoryAccordion({ subcategories, locale, dictionary }: SubcategoryAccordionProps) {
  if (!subcategories || subcategories.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <Accordion type="single" collapsible className="w-full">
        {subcategories.map((subcategory) => {
          const subcategoryTranslation = subcategory.translations.find(
            (t) => t.language_code === locale
          ) || subcategory.translations[0];

          return (
            <AccordionItem 
              key={subcategory.id} 
              value={subcategory.id.toString()}
              className="border-l-2 border-zinc-300 dark:border-zinc-600 pl-2"
            >
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="text-left">
                  <div className="font-semibold text-zinc-900 dark:text-white text-base">
                    {subcategoryTranslation?.label || subcategory.slug}
                    {subcategory.items && subcategory.items.length > 0 && (
                      <span className="ml-2 text-xs font-normal text-zinc-500 dark:text-zinc-400">
                        ({subcategory.items.length} {subcategory.items.length === 1 ? dictionary.topics.item : dictionary.topics.items})
                      </span>
                    )}
                  </div>
                  {subcategoryTranslation?.description && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 font-normal">
                      {subcategoryTranslation.description}
                    </p>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {/* Items under subcategory */}
                {subcategory.items && subcategory.items.length > 0 ? (
                  <div className="space-y-3 mt-2 ml-2">
                    {subcategory.items.map((item) => {
                      const itemTranslation = item.translations.find(
                        (t) => t.language_code === locale
                      ) || item.translations[0];

                      return (
                        <div
                          key={item.id}
                          className="border-l-2 border-green-400 dark:border-green-600 pl-4 py-2 bg-green-50/50 dark:bg-green-950/20 rounded-r"
                        >
                          <ItemDetail
                            title={itemTranslation?.label}
                            fallbackSlug={item.slug}
                            description={itemTranslation?.description}
                            references={item.quran_refs}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 italic ml-2">
                    {dictionary.topics.noItemsAvailable}
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

