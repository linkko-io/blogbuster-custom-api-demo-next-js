import { Tenant, Article } from '../types';

const API_BASE_URL = 'https://api.blogbuster.so/api/v1';

export class ApiClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async fetchWithAuth(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'accept': 'application/json',
        'X-API-Key': this.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getTenants(): Promise<Tenant[]> {
    return this.fetchWithAuth('/get_tenants');
  }

  async getTenantArticles(tenantId: string): Promise<Article[]> {
    return this.fetchWithAuth(`/get_tenant_articles?tenant_id=${tenantId}`);
  }

  async getArticle(tenantId: string, articleId: string): Promise<Article> {
    return this.fetchWithAuth(`/get_tenant_articles?tenant_id=${tenantId}&article_id=${articleId}`);
  }
} 