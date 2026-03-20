import { useState, useEffect } from 'react'
import { Container, Box, Grid, CircularProgress, Typography, Tabs, Tab } from '@mui/material'
import { motion } from 'framer-motion'
import SectionTitle from '../components/ui/SectionTitle'
import ProjectCard from '../components/sections/projects/ProjectCard'
import PageWrapper from '../components/layout/PageWrapper'
import { fetchGitHubRepos, fetchFeaturedProjects } from '../api/projects'
import type { GitHubRepo, Project } from '../api/projects'
import { FEATURED_PROJECTS } from '../constants/personal'
import { staggerContainer, fadeInUp } from '../utils/animationVariants'

export default function ProjectsPage() {
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([])
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'featured' | 'github'>('featured')

  useEffect(() => {
    Promise.all([fetchGitHubRepos(), fetchFeaturedProjects()])
      .then(([repos, featured]) => {
        setGithubRepos(repos)
        setFeaturedProjects(featured)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const displayFeatured = featuredProjects.length > 0
    ? featuredProjects
    : FEATURED_PROJECTS

  return (
    <PageWrapper>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <SectionTitle
          title="My Projects"
          subtitle="A showcase of things I've built — from AI tools to full-stack platforms."
        />

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            mb: 4,
            '& .MuiTabs-indicator': { background: 'linear-gradient(90deg, #00B4D8, #7C3AED)', height: 3, borderRadius: 2 },
            '& .MuiTab-root': { color: 'text.secondary', textTransform: 'none', fontWeight: 500, '&.Mui-selected': { color: '#00B4D8', fontWeight: 600 } },
          }}
        >
          <Tab label="Featured Projects" value="featured" />
          <Tab label="GitHub Repositories" value="github" />
        </Tabs>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#00B4D8' }} />
          </Box>
        ) : tab === 'featured' ? (
          <Box
            component={motion.div}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              {displayFeatured.map((p, i) => (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={i}>
                  <motion.div variants={fadeInUp}>
                    <ProjectCard
                      title={p.title || (p as any).title}
                      description={p.description || ''}
                      tech={(p as any).tech_stack || (p as any).tech || []}
                      github={(p as any).github_url || (p as any).github}
                      live={(p as any).live_url || (p as any).live}
                      featured
                    />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Box
            component={motion.div}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {githubRepos.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography color="text.secondary">GitHub repositories unavailable. Check back later.</Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {githubRepos.map((repo, i) => (
                  <Grid size={{ xs: 12, md: 6, lg: 4 }} key={i}>
                    <motion.div variants={fadeInUp}>
                      <ProjectCard
                        title={repo.name}
                        description={repo.description || 'No description provided.'}
                        tech={repo.topics.length > 0 ? repo.topics : [repo.language || 'Code']}
                        github={repo.html_url}
                        live={repo.homepage || undefined}
                        stars={repo.stargazers_count}
                        forks={repo.forks_count}
                        language={repo.language || undefined}
                      />
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
      </Container>
    </PageWrapper>
  )
}
