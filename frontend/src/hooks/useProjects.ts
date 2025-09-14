import { useQuery } from '@tanstack/react-query';
import { getProjects, getProject, getProjectTypes, getTechnologies, ProjectsQueryParams } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';

// Hook for fetching projects with filters
export const useProjects = (params: ProjectsQueryParams = {}) => {
  const { currentLanguage } = useLanguage();
  
  return useQuery({
    queryKey: ['projects', params, currentLanguage.code],
    queryFn: () => getProjects(params, currentLanguage.code),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Hook for fetching single project
export const useProject = (id: string) => {
  const { currentLanguage } = useLanguage();
  
  return useQuery({
    queryKey: ['project', id, currentLanguage.code],
    queryFn: () => getProject(id, currentLanguage.code),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

// Hook for fetching project types
export const useProjectTypes = () => {
  const { currentLanguage } = useLanguage();

  const query = useQuery({
    queryKey: ['projectTypes', currentLanguage.code],
    queryFn: () => getProjectTypes(currentLanguage.code),
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });

  // Normalize: always return an array
  const data = Array.isArray(query.data)
    ? query.data
    : query.data?.result || [];

  return { ...query, data };
};

// Hook for fetching technologies
export const useTechnologies = () => {
  const { currentLanguage } = useLanguage();

  const query = useQuery({
    queryKey: ['technologies', currentLanguage.code],
    queryFn: () => getTechnologies(currentLanguage.code),
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });

  // Normalize: always return an array
  const data = Array.isArray(query.data)
    ? query.data
    : query.data?.results || [];

  return { ...query, data };
};