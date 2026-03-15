import { useState, useEffect } from 'react'
import { Box, Typography, Button, CircularProgress, Alert, Table, TableBody, TableCell, TableHead, TableRow, Chip } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { uploadResume, getResumeVersions, activateResume } from '../../api/admin'
import GlassCard from '../../components/ui/GlassCard'

interface ResumeVersion {
  id: string
  file_name: string
  public_url: string
  is_active: boolean
  uploaded_at: string
}

export default function AdminResumeManager() {
  const [versions, setVersions] = useState<ResumeVersion[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const load = () => getResumeVersions().then(setVersions).catch(() => {})

  useEffect(() => { load() }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setError(''); setSuccess('')
    try {
      await uploadResume(file)
      setSuccess('Resume uploaded successfully!')
      load()
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleActivate = async (id: string) => {
    try {
      await activateResume(id)
      setSuccess('Resume activated.')
      load()
    } catch {
      setError('Failed to activate.')
    }
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ color: '#E2E8F0', mb: 4 }}>Resume Manager</Typography>

      <GlassCard sx={{ p: 4, mb: 4, textAlign: 'center' }}>
        <UploadFileIcon sx={{ fontSize: 48, color: '#00B4D8', mb: 2 }} />
        <Typography sx={{ color: '#E2E8F0', mb: 1 }}>Upload New Resume</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>PDF files only. The uploaded file will be available for download after activation.</Typography>
        <Button variant="contained" component="label" disabled={uploading}
          startIcon={uploading ? <CircularProgress size={18} color="inherit" /> : <UploadFileIcon />}
          sx={{ background: 'linear-gradient(135deg, #00B4D8, #7C3AED)', fontWeight: 700 }}>
          {uploading ? 'Uploading...' : 'Choose PDF'}
          <input type="file" accept=".pdf" hidden onChange={handleUpload} />
        </Button>
        {error && <Alert severity="error" sx={{ mt: 2, background: 'rgba(239,68,68,0.1)' }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2, background: 'rgba(16,185,129,0.1)' }}>{success}</Alert>}
      </GlassCard>

      <GlassCard sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ color: '#E2E8F0', mb: 2 }}>Version History</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#64748B', borderBottom: '1px solid rgba(0,180,216,0.15)' }}>File</TableCell>
              <TableCell sx={{ color: '#64748B', borderBottom: '1px solid rgba(0,180,216,0.15)' }}>Uploaded</TableCell>
              <TableCell sx={{ color: '#64748B', borderBottom: '1px solid rgba(0,180,216,0.15)' }}>Status</TableCell>
              <TableCell sx={{ color: '#64748B', borderBottom: '1px solid rgba(0,180,216,0.15)' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {versions.map((v) => (
              <TableRow key={v.id}>
                <TableCell sx={{ color: '#E2E8F0', borderBottom: '1px solid rgba(0,180,216,0.08)', fontSize: '0.8rem' }}>{v.file_name}</TableCell>
                <TableCell sx={{ color: '#94A3B8', borderBottom: '1px solid rgba(0,180,216,0.08)', fontSize: '0.8rem' }}>{new Date(v.uploaded_at).toLocaleDateString()}</TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(0,180,216,0.08)' }}>
                  {v.is_active ? <Chip label="Active" size="small" icon={<CheckCircleIcon />} sx={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }} /> : <Chip label="Inactive" size="small" sx={{ background: 'rgba(100,116,139,0.15)', color: '#64748B' }} />}
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(0,180,216,0.08)' }}>
                  {!v.is_active && <Button size="small" onClick={() => handleActivate(v.id)} sx={{ color: '#00B4D8', textTransform: 'none', fontSize: '0.75rem' }}>Set Active</Button>}
                </TableCell>
              </TableRow>
            ))}
            {versions.length === 0 && (
              <TableRow><TableCell colSpan={4} sx={{ color: '#64748B', textAlign: 'center', py: 4 }}>No resume versions uploaded yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </GlassCard>
    </Box>
  )
}
