import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface NormalizedPagination<T> {
  items: T[];
  count: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
  next: string | null;
  previous: string | null;
}

export interface ApiErrorResult {
  message: string;
  statusCode?: number;
  fieldErrors?: Record<string, string[]>;
}

@Injectable()
export class ApiClientService {
  private readonly logger = new Logger(ApiClientService.name);
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.DJANGO_API_BASE_URL || 'http://localhost:7777/api/v1';
  }

  private createClient(token?: string): AxiosInstance {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }

    return axios.create({
      baseURL: this.baseUrl,
      headers,
      timeout: 10000,
    });
  }

  /**
   * Helper to normalize raw DRF responses (array or paginated object) into a standardized pagination object.
   */
  adaptPaginated<T>(data: any, currentPage = 1, pageSize = 20): NormalizedPagination<T> {
    if (!data) {
      return {
        items: [],
        count: 0,
        totalPages: 1,
        currentPage: 1,
        pageSize,
        hasNext: false,
        hasPrev: false,
        next: null,
        previous: null,
      };
    }

    if (Array.isArray(data)) {
      const totalCount = data.length;
      return {
        items: data,
        count: totalCount,
        totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
        currentPage: 1,
        pageSize,
        hasNext: false,
        hasPrev: false,
        next: null,
        previous: null,
      };
    }

    const items: T[] = Array.isArray(data.results) ? data.results : [];
    const count: number = typeof data.count === 'number' ? data.count : items.length;
    const totalPages = Math.max(1, Math.ceil(count / pageSize));

    return {
      items,
      count,
      totalPages,
      currentPage,
      pageSize,
      hasNext: Boolean(data.next),
      hasPrev: Boolean(data.previous),
      next: data.next || null,
      previous: data.previous || null,
    };
  }

  async get<T>(endpoint: string, params?: Record<string, any>, token?: string): Promise<T> {
    try {
      const client = this.createClient(token);
      // Clean query parameters
      const cleanParams: Record<string, any> = {};
      if (params) {
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
            cleanParams[key] = params[key];
          }
        });
      }
      const response = await client.get<T>(endpoint, { params: cleanParams });
      return response.data;
    } catch (error: any) {
      this.handleError(error, endpoint);
      throw error;
    }
  }

  async post<T>(endpoint: string, data: any, token?: string, isFormData = false): Promise<T> {
    try {
      const client = this.createClient(token);
      const config: AxiosRequestConfig = {};
      if (isFormData) {
        config.headers = { 'Content-Type': 'multipart/form-data' };
      }
      const response = await client.post<T>(endpoint, data, config);
      return response.data;
    } catch (error: any) {
      this.handleError(error, endpoint);
      throw error;
    }
  }

  async put<T>(endpoint: string, data: any, token?: string): Promise<T> {
    try {
      const client = this.createClient(token);
      const response = await client.put<T>(endpoint, data);
      return response.data;
    } catch (error: any) {
      this.handleError(error, endpoint);
      throw error;
    }
  }

  async patch<T>(endpoint: string, data: any, token?: string): Promise<T> {
    try {
      const client = this.createClient(token);
      const response = await client.patch<T>(endpoint, data);
      return response.data;
    } catch (error: any) {
      this.handleError(error, endpoint);
      throw error;
    }
  }

  async postMultipart<T>(endpoint: string, formData: any, token?: string): Promise<T> {
    try {
      const headers: Record<string, string> = {
        ...formData.getHeaders(),
      };
      if (token) {
        headers['Authorization'] = `Token ${token}`;
      }
      const response = await axios.post<T>(`${this.baseUrl}${endpoint}`, formData, {
        headers,
        timeout: 15000,
      });
      return response.data;
    } catch (error: any) {
      this.handleError(error, endpoint);
      throw error;
    }
  }

  async patchMultipart<T>(endpoint: string, formData: any, token?: string): Promise<T> {
    try {
      const headers: Record<string, string> = {
        ...formData.getHeaders(),
      };
      if (token) {
        headers['Authorization'] = `Token ${token}`;
      }
      const response = await axios.patch<T>(`${this.baseUrl}${endpoint}`, formData, {
        headers,
        timeout: 15000,
      });
      return response.data;
    } catch (error: any) {
      this.handleError(error, endpoint);
      throw error;
    }
  }

  async delete<T>(endpoint: string, token?: string): Promise<T> {
    try {
      const client = this.createClient(token);
      const response = await client.delete<T>(endpoint);
      return response.data;
    } catch (error: any) {
      this.handleError(error, endpoint);
      throw error;
    }
  }

  formatApiError(error: any): ApiErrorResult {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (typeof data === 'string') {
        return { message: data, statusCode: status };
      }

      if (data && typeof data === 'object') {
        if (data.detail) {
          return { message: data.detail, statusCode: status };
        }
        if (data.error) {
          return { message: data.error, statusCode: status };
        }
        // Field validation errors object (e.g. { title: ["This field is required."] })
        const errorEntries = Object.entries(data);
        const detailedErrors = errorEntries
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
          .join('; ');

        return {
          message: detailedErrors ? `Validation failed: ${detailedErrors}` : 'Validation failed for one or more input fields.',
          statusCode: status,
          fieldErrors: data,
        };
      }
    }

    if (error.request) {
      return { message: 'No response received from DRF API server. Please check backend status.' };
    }

    return { message: error.message || 'An unexpected API request error occurred.' };
  }

  private handleError(error: any, endpoint: string) {
    if (error.response) {
      this.logger.error(
        `DRF API Error [${error.response.status}] at ${endpoint}: ${JSON.stringify(error.response.data)}`
      );
    } else if (error.request) {
      this.logger.error(`DRF API Network Error at ${endpoint}: No response received.`);
    } else {
      this.logger.error(`API Request Error at ${endpoint}: ${error.message}`);
    }
  }
}
