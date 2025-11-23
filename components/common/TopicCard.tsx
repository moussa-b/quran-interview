import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { TopicWithTranslations } from '@/lib/api/services/types';

interface TopicCardProps {
  topic: TopicWithTranslations;
  locale: string;
  translations: {
    categories: string;
    subcategories: string;
    chapters: string;
    verses: string;
    viewTopic: string;
  };
}

export function TopicCard({ topic, locale, translations }: TopicCardProps) {
  const translation = topic.translations.find(t => t.language_code === locale) || topic.translations[0];
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>{translation?.label || topic.slug}</CardTitle>
        {translation?.description && (
          <CardDescription>{translation.description}</CardDescription>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary">{topic.categories_count ?? 0}</span>
            <span className="text-sm text-muted-foreground">{translations.categories}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary">{topic.subcategories_count ?? 0}</span>
            <span className="text-sm text-muted-foreground">{translations.subcategories}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary">{topic.chapters_count ?? 0}</span>
            <span className="text-sm text-muted-foreground">{translations.chapters}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary">{topic.verses_count ?? 0}</span>
            <span className="text-sm text-muted-foreground">{translations.verses}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Link href={`/${locale}/${topic.slug}`} className="w-full">
          <Button variant="outline" className="w-full cursor-pointer">
            {translations.viewTopic}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

