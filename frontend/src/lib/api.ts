// API Configuration
const _env = (
  import.meta as unknown as { env?: Record<string, string | undefined> }
).env;
const API_BASE_URL =
  _env?.VITE_API_URL

// API Types based on your backend
export interface Project {
  id: string;
  title: {
    en: string;
    ru: string;
    uz: string;
  };
  description: {
    en: string;
    ru: string;
    uz: string;
  };
  slug: string;
  project_type: {
    id: string;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
  };
  technologies: Technology[];
  repository_url: string | null;
  live_url: string | null;
  status: "draft" | "in_progress" | "completed" | "archived";
  views: number;
  priority: number;
  start_date: string | null;
  end_date: string | null;
  is_featured: boolean;
  cover_image: string;
  images: ProjectImage[];
  created_at: string;
  updated_at: string;
}

export interface Technology {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface ProjectType {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectImage {
  id: number;
  project: string;
  image: string;
  alt_text: string;
  is_cover: boolean;
  uploaded_at: string;
}

export interface ProjectsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Project[];
}

// API Query Parameters
export interface ProjectsQueryParams {
  page?: number;
  size?: number;
  search?: string;
  project_type?: string;
  technologies?: string;
  status?: string;
  is_featured?: boolean;
  ordering?: string;
  end_date_before?: string;
}

// API Service Class
class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async fetchWithLanguage<T>(
    endpoint: string,
    language: "en" | "ru" | "uz" = "en",
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      Accept: "application/json",
      "Accept-Language": language,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Get projects with filters and pagination
  async getProjects(
    params: ProjectsQueryParams = {},
    language: "en" | "ru" | "uz" = "en"
  ): Promise<ProjectsResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const endpoint = `/projects/projects/?${searchParams.toString()}`;
    return this.fetchWithLanguage<ProjectsResponse>(endpoint, language);
  }

  // Get single project by ID
  async getProject(
    id: string,
    language: "en" | "ru" | "uz" = "en"
  ): Promise<Project> {
    return this.fetchWithLanguage<Project>(
      `/projects/projects/${id}/`,
      language
    );
  }

  // Get all project types
  async getProjectTypes(
    language: "en" | "ru" | "uz" = "en"
  ): Promise<ProjectType[]> {
    return this.fetchWithLanguage<ProjectType[]>(
      "/projects/project-types/",
      language
    );
  }

  // Get all technologies
  async getTechnologies(
    language: "en" | "ru" | "uz" = "en"
  ): Promise<Technology[]> {
    return this.fetchWithLanguage<Technology[]>(
      "/projects/technologies/",
      language
    );
  }

  // Get project images
  async getProjectImages(
    language: "en" | "ru" | "uz" = "en"
  ): Promise<ProjectImage[]> {
    return this.fetchWithLanguage<ProjectImage[]>(
      "/projects/project-images/",
      language
    );
  }
}

// Export API instance
export const api = new ApiService(API_BASE_URL);

// Export convenience functions
export const getProjects = (
  params?: ProjectsQueryParams,
  language?: "en" | "ru" | "uz"
) => api.getProjects(params, language);

export const getProject = (id: string, language?: "en" | "ru" | "uz") =>
  api.getProject(id, language);

export const getProjectTypes = (language?: "en" | "ru" | "uz") =>
  api.getProjectTypes(language);

export const getTechnologies = (language?: "en" | "ru" | "uz") =>
  api.getTechnologies(language);

export const getProjectImages = (language?: "en" | "ru" | "uz") =>
  api.getProjectImages(language);

// Provide default export for legacy imports that expect API_BASE_URL
export default API_BASE_URL;
