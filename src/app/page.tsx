'use client';

import { useEffect, useState } from 'react';
import { Tenant } from '../types';
import { ApiClient } from '../lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
    const apiClient = new ApiClient(apiKey);

    const fetchTenants = async () => {
      try {
        const data = await apiClient.getTenants();
        setTenants(data);
      } catch (err) {
        setError('Failed to fetch tenants');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  const handleCardClick = (tenantId: string) => {
    router.push(`/tenant/${tenantId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center hero-pattern">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
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
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to BlogBuster
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing content from our diverse collection of publishers and blogs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tenants.map((tenant) => (
            <div 
              key={tenant.tenant_id}
              className="glass-card rounded-xl p-8 h-full hover-lift cursor-pointer"
              onClick={() => handleCardClick(tenant.tenant_id)}
            >
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {tenant.tenant_name}
                </h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              <p className="text-gray-600 mb-6 line-clamp-3">
                {tenant.description}
              </p>
              <div className="flex items-center justify-between">
                <a 
                  href={tenant.website_domain}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  Visit Website
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <div className="flex items-center text-gray-500 text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M15 3v4h4M21 14l-3 3m0 0l-3-3m3 3v-6" />
                  </svg>
                  View Articles
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
