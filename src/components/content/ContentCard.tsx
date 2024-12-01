import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Tag } from 'lucide-react';
import { Content, ContentLanguage } from '../../types/content';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface ContentCardProps {
  content: Content;
  language: ContentLanguage;
}

export function ContentCard({ content, language }: ContentCardProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {content.thumbnailUrl && (
        <img
          src={content.thumbnailUrl}
          alt={content.title[language]}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded">
            {t(`contentTypes.${content.type}`)}
          </span>
          {content.duration && (
            <span className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {content.duration} min
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold mb-2">
          <Link to={`/content/${content.id}`} className="text-gray-900 hover:text-indigo-600">
            {content.title[language]}
          </Link>
        </h3>

        <p className="text-gray-600 text-sm mb-4">
          {content.description[language]}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {content.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded"
            >
              <Tag className="w-3 h-3 mr-1" />
              {t(`tags.${tag}`)}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{content.author}</span>
          <span>{formatDistanceToNow(new Date(content.updatedAt), { addSuffix: true })}</span>
        </div>
      </div>
    </div>
  );
}