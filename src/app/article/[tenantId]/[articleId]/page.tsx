import { Article } from '../../../../types';
import { ApiClient } from '../../../../lib/api';
import Link from 'next/link';
import Image from 'next/image';

export default async function ArticlePage({
  params,
}: {
  params: { tenantId: string; articleId: string };
}) {
  const unwrappedParams = await Promise.resolve(params);
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
  const apiClient = new ApiClient(apiKey);
  
  let article: Article | null = null;
  let error: string | null = null;

  try {
    article = await apiClient.getArticle(unwrappedParams.tenantId, unwrappedParams.articleId);
  } catch (err) {
    error = 'Failed to fetch article';
    console.error(err);
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center hero-pattern">
        <div className="text-red-500 glass-card p-6 rounded-lg">{error || 'Article not found'}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen hero-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <Link
            href={`/tenant/${unwrappedParams.tenantId}`}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Articles
          </Link>
        </div>

        <article className="glass-card rounded-xl overflow-hidden max-w-4xl mx-auto">
          <div className="relative h-[60vh] max-h-[600px]">
            <Image
              src={article.hero_image_url}
              alt={article.alt_text}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags && article.tags.length > 0 && article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm font-medium bg-white/20 backdrop-blur-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{article.title}</h1>
              <p className="text-lg text-white/90 max-w-3xl">{article.meta_description}</p>
              <div className="mt-4 text-sm text-white/70">
                Published on {new Date(article.created_on).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-blue-600 hover:prose-a:text-blue-800"
              dangerouslySetInnerHTML={{ __html: article.html_content }}
            />
          </div>
        </article>
      </div>
    </main>
  );
} 