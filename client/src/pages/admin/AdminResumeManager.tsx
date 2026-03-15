import { useEffect, useRef, useState } from 'react'
import {
  Box, Typography, CircularProgress, Button, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DeleteIcon from '@mui/icons-material/Delete'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import GlassCard from '../../components/ui/GlassCard'
import { fetchResumeVersions, activateResume, uploadResume, deleteResume } from '../../api/resume'
import type { ResumeVersion } from '../../api/resume'

export default function AdminResumeManager() {
  const [versions, setVersions] = useState<ResumeVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [activating, setActivating] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ResumeVersion | null>(null)
  const [deleting, setDeleting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = () =>
    fetchResumeVersions()
      .then(setVersions)
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Only PDF files are supported.')
      return
    }
    setUploadError('')
    setUploading(true)
    try {
      const newVersion = await uploadResume(file)
      setVersions((prev) => [newVersion, ...prev])
    } catch {
      setUploadError('Upload failed. Make sure the "resumes" bucket exists in Supabase Storage.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleActivate = async (id: string) => {
    setActivating(id)
    try {
      await activateResume(id)
      setVersions((prev) => prev.map((v) => ({ ...v, is_active: v.id === id })))
    } finally {
      setActivating(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteResume(deleteTarget.id)
      setVersions((prev) => prev.filter((v) => v.id !== deleteTarget.id))
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  const active = versions.find((v) => v.is_active)

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress sx={{ color: '#00B4D8' }} />
    </Box>
  )

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="#E2E8F0">Resume Manager</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Upload PDF versions and control which one visitors can download.
          </Typography>
        </Box>
        {active && (
          <Chip
            icon={<RadioButtonCheckedIcon sx={{ fontSize: '13px !important', color: '#10B981 !important' }} />}
            label={`Live: ${active.file_name}`}
            sx={{ bgcolor: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', maxWidth: 280 }}
          />
        )}
      </Box>

      {/* Upload Zone */}
      <GlassCard
        hover={false}
        onDragOver={(e: React.DragEvent) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        sx={{
          p: 5, mb: 4, textAlign: 'center', cursor: uploading ? 'default' : 'pointer',
          border: `2px dashed ${dragging ? '#00B4D8' : 'rgba(0,180,216,0.25)'}`,
          background: dragging ? 'rgba(0,180,216,0.06)' : undefined,
          transition: 'all 0.2s',
          '&:hover': { borderColor: uploading ? undefined : 'rgba(0,180,216,0.55)' },
        }}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          style={{ display: 'none' }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }}
        />
        {uploading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={36} sx={{ color: '#00B4D8' }} />
            <Typography color="text.secondary">Uploading to Supabase Storage...</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(0,180,216,0.2), rgba(124,58,237,0.2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <UploadFileIcon sx={{ color: '#00B4D8', fontSize: 28 }} />
            </Box>
            <Typography fontWeight={600} color="#E2E8F0">
              {dragging ? 'Drop PDF here' : 'Click to upload or drag & drop'}
            </Typography>
            <Typography variant="caption" color="text.secondary">PDF only · Max 10 MB</Typography>
          </Box>
        )}
        {uploadError && (
          <Typography variant="caption" sx={{ color: '#EF4444', display: 'block', mt: 2 }}>{uploadError}</Typography>
        )}
      </GlassCard>

      {/* Versions List */}
      {versions.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <PictureAsPdfIcon sx={{ fontSize: 52, color: 'rgba(100,116,139,0.3)', mb: 2 }} />
          <Typography color="text.secondary">No resume versions yet. Upload your first PDF above.</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2, fontSize: 11 }}>
            {versions.length} version{versions.length !== 1 ? 's' : ''}
          </Typography>
          {versions.map((v) => (
            <GlassCard
              key={v.id}
              hover={false}
              sx={{
                p: 2.5,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                border: v.is_active ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.05)',
                background: v.is_active ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.02)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, overflow: 'hidden', flex: 1 }}>
                <Box sx={{
                  width: 40, height: 40, flexShrink: 0, borderRadius: 2,
                  background: v.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(0,180,216,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <PictureAsPdfIcon sx={{ color: v.is_active ? '#10B981' : '#00B4D8', fontSize: 20 }} />
                </Box>
                <Box sx={{ overflow: 'hidden', flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography fontWeight={600} color="#E2E8F0" noWrap sx={{ maxWidth: { xs: 140, md: 320 } }}>
                      {v.file_name}
                    </Typography>
                    {v.is_active && (
                      <Chip
                        icon={<CheckCircleIcon sx={{ fontSize: '12px !important' }} />}
                        label="Live"
                        size="small"
                        sx={{ bgcolor: 'rgba(16,185,129,0.15)', color: '#10B981', height: 20, fontSize: 11 }}
                      />
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(v.uploaded_at).toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexShrink: 0, ml: 2 }}>
                <Button
                  component="a" href={v.public_url} target="_blank"
                  size="small" endIcon={<OpenInNewIcon sx={{ fontSize: '13px !important' }} />}
                  sx={{ color: '#64748B', textTransform: 'none', fontSize: 13, minWidth: 0 }}
                >
                  View
                </Button>
                {!v.is_active && (
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={!!activating}
                    onClick={() => handleActivate(v.id)}
                    sx={{
                      borderColor: 'rgba(0,180,216,0.4)', color: '#00B4D8',
                      textTransform: 'none', fontSize: 13, whiteSpace: 'nowrap',
                      '&:hover': { borderColor: '#00B4D8', background: 'rgba(0,180,216,0.08)' },
                    }}
                  >
                    {activating === v.id ? <CircularProgress size={14} color="inherit" /> : 'Set Live'}
                  </Button>
                )}
                <Button
                  size="small"
                  onClick={() => setDeleteTarget(v)}
                  sx={{ minWidth: 36, color: '#EF4444', '&:hover': { background: 'rgba(239,68,68,0.08)' } }}
                >
                  <DeleteIcon sx={{ fontSize: 18 }} />
                </Button>
              </Box>
            </GlassCard>
          ))}
        </Box>
      )}

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        PaperProps={{ sx: { bgcolor: '#0E1426', border: '1px solid rgba(0,180,216,0.15)', borderRadius: 3, minWidth: 360 } }}
      >
        <DialogTitle sx={{ color: '#E2E8F0', fontWeight: 700 }}>Delete Resume Version?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
            This will permanently delete{' '}
            <strong style={{ color: '#E2E8F0' }}>{deleteTarget?.file_name}</strong>{' '}
            from storage. This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setDeleteTarget(null)}
            disabled={deleting}
            sx={{ color: '#64748B', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleting}
            variant="contained"
            startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
            sx={{ background: '#EF4444', textTransform: 'none', fontWeight: 700, '&:hover': { background: '#DC2626' } }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
