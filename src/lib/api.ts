const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

class ApiClient {
  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("adminToken");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requireAuth: boolean = true
  ): Promise<T> {
    const token = this.getToken();
    
    // Merge headers properly - our headers take precedence
    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Only add token if auth is required and token exists
    if (requireAuth && token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    // Merge with any existing headers from options
    const headers = new Headers(options.headers);
    Object.entries(defaultHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });

    const url = `${API_URL}${endpoint}`;
    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`, {
      hasToken: requireAuth && !!token,
      requireAuth,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
      headers: Object.fromEntries(headers.entries())
    });

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log(`📡 API Response: ${response.status} ${response.statusText}`, {
      endpoint,
      ok: response.ok
    });

    if (!response.ok) {
      // Don't automatically clear token or redirect here
      // Let the components and route guard handle 401 errors
      if (response.status === 401) {
        console.error("🚫 401 Unauthorized for", endpoint);
        throw new Error("Unauthorized - Please login again");
      }

      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    // Handle 204 No Content responses (DELETE endpoints)
    if (response.status === 204) {
      return undefined as T;
    }

    // Get response text first to check if there's any content
    const text = await response.text();
    
    // If no content, return undefined
    if (!text || text.trim().length === 0) {
      return undefined as T;
    }

    // Try to parse as JSON
    try {
      return JSON.parse(text) as T;
    } catch (error) {
      // If it's not valid JSON, return the text as-is or throw
      // For most API endpoints, we expect JSON, so throw an error
      throw new Error(`Failed to parse JSON response: ${error}`);
    }
  }

  // Auth
  async login(username: string, password: string) {
    return this.request<{ accessToken: string; admin: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  async verifyToken() {
    return this.request<{ valid: boolean; user: any }>("/auth/verify", {
      method: "GET",
    });
  }

  // Products
  async getProducts(search?: string) {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    return this.request<any[]>(`/products${query}`, {}, false);
  }

  async getProduct(id: string) {
    return this.request<any>(`/products/${id}`, {}, false);
  }

  async getProductBySlug(slug: string) {
    return this.request<any>(`/products/slug/${slug}`, {}, false);
  }

  async getProductsByCategory(category: string) {
    return this.request<any[]>(`/products/category/${category}`, {}, false);
  }

  async createProduct(data: any) {
    return this.request<any>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string, data: any) {
    return this.request<any>(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string) {
    return this.request<void>(`/products/${id}`, {
      method: "DELETE",
    });
  }

  // Categories
  async getCategories() {
    return this.request<any[]>("/categories", {}, false);
  }

  async getCategory(id: string) {
    return this.request<any>(`/categories/${id}`);
  }

  async getCategoryStats(id: string) {
    return this.request<any>(`/categories/${id}/stats`);
  }

  async createCategory(data: any) {
    return this.request<any>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: any) {
    return this.request<any>(`/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string) {
    return this.request<void>(`/categories/${id}`, {
      method: "DELETE",
    });
  }

  // Orders
  async getOrders(status?: string) {
    const query = status ? `?status=${status}` : "";
    const token = this.getToken();
    console.log("🔍 getOrders called", { status, hasToken: !!token, tokenLength: token?.length });
    try {
      const result = await this.request<any[]>(`/orders${query}`);
      console.log("✅ getOrders success", { count: result?.length });
      return result;
    } catch (error: any) {
      console.error("❌ getOrders error", { message: error.message, status: error.status });
      throw error;
    }
  }

  async getOrder(id: string) {
    return this.request<any>(`/orders/${id}`);
  }

  async createOrder(data: any) {
    // Orders endpoint is public, don't send auth token
    return this.request<any>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }, false);
  }

  async updateOrderStatus(id: string, status: string) {
    return this.request<any>(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async deleteOrder(id: string) {
    return this.request<void>(`/orders/${id}`, {
      method: "DELETE",
    });
  }

  // Analytics
  async getDashboardStats() {
    return this.request<any>("/analytics/dashboard");
  }

  async getSalesReport(period: "weekly" | "monthly" | "yearly" = "monthly") {
    return this.request<any>(`/analytics/report?period=${period}`);
  }

  // Image Upload
  async uploadImage(file: File, folder?: string): Promise<string> {
    const { uploadImageToCloudinary } = await import('./cloudinary');
    const result = await uploadImageToCloudinary(file, folder);
    return result.secureUrl;
  }
}

export const api = new ApiClient();

