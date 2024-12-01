import React from 'react';
import { ContentCard } from './ContentCard';
import { Content, ContentFilters, ContentLanguage } from '../../types/content';
import { useTranslation } from 'react-i18next';

interface ContentListProps {
  contents: Content[];
  filters: ContentFilters;
  language: ContentLanguage;
}

export function ContentList({ contents, filters, language }: ContentListProps) {
  const { t } = useTranslation();
  const filteredContents = contents.filter(content => {
    if (filters.type && content.type !== filters.type) return false;
    if (filters.tags?.length && !filters.tags.some(tag => content.tags.includes(tag))) return false;
    if (filters.difficulty && content.difficulty !== filters.difficulty) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const titleLower = content.title[language].toLowerCase();
      const descLower = content.description[language].toLowerCase();
      if (!titleLower.includes(searchLower) && !descLower.includes(searchLower)) return false;
    }
    return true;
  });

  if (filteredContents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t('content.noResults')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredContents.map(content => (
        <ContentCard key={content.id} content={content} language={language} />
      ))}
    </div>
  );
}