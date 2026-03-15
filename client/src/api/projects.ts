import apiClient from './client'

export interface Project {
  id: string
  title: string
  description: string
  tech_stack: string[]
  github_url?: string
  live_url?: string
  thumbnail_url?: string
  is_featured: boolean
  is_github_repo: boolean
  github_repo_name?: string
  display_order: number
  is_visible: boolean
}

export interface GitHubRepo {
  name: string
  description: string
  html_url: string
  homepage?: string
  topics: string[]
  stargazers_count: number
  forks_count: number
  language?: string
  updated_at: string
}

export const fetchFeaturedProjects = () =>
  apiClient.get<Project[]>('/api/projects/featured').then((r) => r.data)

export const fetchProjects = () =>
  apiClient.get<Project[]>('/api/projects').then((r) => r.data)

export const fetchAllProjects = () =>
  apiClient.get<Project[]>('/api/projects/all').then((r) => r.data)

export const toggleProjectVisibility = (id: string, is_visible: boolean) =>
  apiClient.patch(`/api/projects/${id}`, { is_visible }).then((r) => r.data)

export const fetchGitHubRepos = () =>
  apiClient.get<GitHubRepo[]>('/api/github/repos').then((r) => r.data)
