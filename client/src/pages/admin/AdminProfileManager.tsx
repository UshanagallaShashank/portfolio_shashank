import { useEffect, useRef, useState } from 'react'
import {
  Box, Typography, CircularProgress, Button, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, Avatar,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import ImageIcon from '@mui/icons-material/Image'
import GlassCard from '../../components/ui/GlassCard'
import apiClient from '../../api/client'
import { invalidateCache } from '../../hooks/useApiCache'

interface ProfilePhoto {
  id: string
  storage_path: string
  public_url: string
  is_active: boolean
  uploaded_at: string
}

export default function AdminProfileManager() {
  const [photos, setPhotos] = useState<ProfilePhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [activating, setActivating] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ProfilePhoto | null>(null)
  const [deleting, setDeleting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = () =>
    apiClient.get<ProfilePhoto[]>('/api/profile/photos')
      .then((r) => setPhotos(r.data))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleFile = async (file: File) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) {
      setUploadError('Only JPG, PNG, WebP or GIF images are supported.')
      return
    }
    setUploadError('')
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    try {
      const res = await apiClient.post<ProfilePhoto>('/api/profile/photos/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setPhotos((prev) => [res.data, ...prev])
    } catch (err: any) {
      const detail = err?.response?.data?.detail ?? ''
      setUploadError(`Upload failed. ${detail || 'Check backend and Supabase storage bucket.'}`)
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
      await apiClient.post(`/api/profile/photos/${id}/activate`)
      setPhotos((prev) => prev.map((p) => ({ ...p, is_active: p.id === id })))
      invalidateCache('profile')
    } finally {
      setActivating(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await apiClient.delete(`/api/profile/photos/${deleteTarget.id}`)
      setPhotos((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  const activePhoto = photos.find((p) => p.is_active)

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress sx={{ color: '#00B4D8' }} />
    </Box>
  )

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="#E2E8F0">Profile Photo</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Upload photos and set one as active — it appears in the hero section of your portfolio.
          </Typography>
        </Box>
        {activePhoto && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              p: 0.3, borderRadius: '50%',
              background: 'conic-gradient(from 0deg, #00B4D8, #7C3AED, #00B4D8)',
            }}>
              <Box sx={{ p: 0.25, borderRadius: '50%', bgcolor: '#0A0F1E' }}>
                <Avatar src={activePhoto.public_url} sx={{ width: 44, height: 44 }} />
              </Box>
            </Box>
            <Chip
              icon={<RadioButtonCheckedIcon sx={{ fontSize: '13px !important', color: '#10B981 !important' }} />}
              label="Live photo"
              sx={{ bgcolor: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }}
            />
          </Box>
        )}
      </Box>

      {/* Upload zone */}
      <GlassCard
        hover={false}
        onDragOver={(e: React.DragEvent) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        sx={{
          p: 5, mb: 4, textAlign: 'center', cursor: uploading ? 'default' : 'pointer',
          border: `2px dashed ${dragging ? '#00B4D8' : 'rgba(0,180,216,0.25)'}`,
          background: dragging ? 'rgba(0,180,216,0.06)' : undefined,
          transition: 'all 0.2s',
          '&:hover': { borderColor: uploading ? undefined : 'rgba(0,180,216,0.55)' },
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
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
              <CloudUploadIcon sx={{ color: '#00B4D8', fontSize: 28 }} />
            </Box>
            <Typography fontWeight={600} color="#E2E8F0">
              {dragging ? 'Drop image here' : 'Click to upload or drag & drop'}
            </Typography>
            <Typography variant="caption" color="text.secondary">JPG, PNG, WebP or GIF · Max 5 MB</Typography>
          </Box>
        )}
        {uploadError && (
          <Typography variant="caption" sx={{ color: '#EF4444', display: 'block', mt: 2 }}>{uploadError}</Typography>
        )}
      </GlassCard>

      {/* Photos list */}
      {photos.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ImageIcon sx={{ fontSize: 52, color: 'rgba(100,116,139,0.3)', mb: 2 }} />
          <Typography color="text.secondary">No photos uploaded yet. Drop an image above to start.</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2, fontSize: 11 }}>
            {photos.length} photo{photos.length !== 1 ? 's' : ''}
          </Typography>
          {photos.map((p) => (
            <GlassCard
              key={p.id}
              hover={false}
              sx={{
                p: 2.5,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                border: p.is_active ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.05)',
                background: p.is_active ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.02)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, overflow: 'hidden', flex: 1 }}>
                <Avatar
                  src={p.public_url}
                  sx={{
                    width: 48, height: 48, flexShrink: 0, borderRadius: 2,
                    border: p.is_active ? '2px solid rgba(16,185,129,0.5)' : '2px solid rgba(255,255,255,0.08)',
                  }}
                />
                <Box sx={{ overflow: 'hidden', flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography fontWeight={600} color="#E2E8F0" noWrap sx={{ maxWidth: { xs: 140, md: 320 } }}>
                      {p.storage_path}
                    </Typography>
                    {p.is_active && (
                      <Chip
                        icon={<CheckCircleIcon sx={{ fontSize: '12px !important' }} />}
                        label="Live"
                        size="small"
                        sx={{ bgcolor: 'rgba(16,185,129,0.15)', color: '#10B981', height: 20, fontSize: 11 }}
                      />
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(p.uploaded_at).toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexShrink: 0, ml: 2 }}>
                <Button
                  component="a" href={p.public_url} target="_blank" rel="noopener noreferrer"
                  size="small"
                  sx={{ color: '#64748B', textTransform: 'none', fontSize: 13, minWidth: 0 }}
                >
                  View
                </Button>
                {!p.is_active && (
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={!!activating}
                    onClick={() => handleActivate(p.id)}
                    sx={{
                      borderColor: 'rgba(0,180,216,0.4)', color: '#00B4D8',
                      textTransform: 'none', fontSize: 13, whiteSpace: 'nowrap',
                      '&:hover': { borderColor: '#00B4D8', background: 'rgba(0,180,216,0.08)' },
                    }}
                  >
                    {activating === p.id ? <CircularProgress size={14} color="inherit" /> : 'Set Live'}
                  </Button>
                )}
                <Button
                  size="small"
                  onClick={() => setDeleteTarget(p)}
                  sx={{ minWidth: 36, color: '#EF4444', '&:hover': { background: 'rgba(239,68,68,0.08)' } }}
                >
                  <DeleteIcon sx={{ fontSize: 18 }} />
                </Button>
              </Box>
            </GlassCard>
          ))}
        </Box>
      )}

      {/* Delete confirm */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        PaperProps={{ sx: { bgcolor: '#0E1426', border: '1px solid rgba(0,180,216,0.15)', borderRadius: 3, minWidth: 360 } }}
      >
        <DialogTitle sx={{ color: '#E2E8F0', fontWeight: 700 }}>Delete Photo?</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            {deleteTarget && <Avatar src={deleteTarget.public_url} sx={{ width: 56, height: 56, borderRadius: 2 }} />}
            <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
              This will permanently remove the photo from storage.
              {deleteTarget?.is_active && (
                <Box component="span" sx={{ color: '#F59E0B', display: 'block', mt: 0.5, fontSize: 13 }}>
                  ⚠ This is your currently live photo.
                </Box>
              )}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleting}
            sx={{ color: '#64748B', textTransform: 'none' }}>Cancel</Button>
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
