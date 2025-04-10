import { Article } from '../../../types';
import { ApiClient } from '../../../lib/api';
import Link from 'next/link';
import Image from 'next/image';

export default async function TenantPage({ params }: { params: { id: string } }) {
  const unwrappedParams = await Promise.resolve(params);
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
  const apiClient = new ApiClient(apiKey);
  
  let articles: Article[] = [];
  let error: string | null = null;

  try {
    articles = await apiClient.getTenantArticles(unwrappedParams.id);
  } catch (err) {
    error = 'Failed to fetch articles';
    console.error(err);
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center hero-pattern">
        <div className="text-red-500 glass-card p-6 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen hero-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <Link 
            href="/" 
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Tenants
          </Link>
          <div className="text-sm text-gray-500">
            {articles.length} Articles Available
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              href={`/article/${unwrappedParams.id}/${article.article_id}`}
              key={article.article_id}
              className="block hover-lift"
            >
              <div className="glass-card rounded-xl overflow-hidden h-full">
                <div className="relative h-48">
                  <Image
                    src={article.hero_image_url}
                    alt={article.alt_text}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex flex-wrap gap-2">
                      {article.tags && article.tags.length > 0 && article.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs font-medium text-white bg-black/30 backdrop-blur-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {new Date(article.created_on).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="text-blue-600 flex items-center">
                      Read More
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
} 