import { Container } from '@mui/material'
import SectionTitle from '../components/ui/SectionTitle'
import ExperienceSection from '../components/sections/experience/ExperienceSection'
import PageWrapper from '../components/layout/PageWrapper'

export default function ExperiencePage() {
  return (
    <PageWrapper>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <SectionTitle
          title="Work Experience"
          subtitle="My professional journey in software development and AI engineering."
        />
        <ExperienceSection />
      </Container>
    </PageWrapper>
  )
}
