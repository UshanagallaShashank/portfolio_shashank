import { useEffect, useRef, useState } from 'react'
import {
  Box, Typography, CircularProgress, Button, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, Avatar, Divider,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import ImageIcon from '@mui/icons-material/Image'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import LinkOffIcon from '@mui/icons-material/LinkOff'
import GlassCard from '../../components/ui/GlassCard'
import apiClient from '../../api/client'
import { invalidateCache } from '../../hooks/useApiCache'
import { assignPhotoToSection, unsetSection, fetchProfile } from '../../api/profile'

interface ProfilePhoto {
  id: string
  storage_path: string
  public_url: string
  is_active: boolean
  uploaded_at: string
}

export default function AdminProfileManager() {
  const [photos, setPhotos] = useState<ProfilePhoto[]>([])
  const [heroUrl, setHeroUrl] = useState<string | null>(null)
  const [aboutUrl, setAboutUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [assigning, setAssigning] = useState<string | null>(null)
  const [unsetting, setUnsetting] = useState<'hero' | 'about' | null>(null)
  const [dragging, setDragging] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ProfilePhoto | null>(null)
  const [deleting, setDeleting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    const [photosRes, profile] = await Promise.all([
      apiClient.get<ProfilePhoto[]>('/api/profile/photos'),
      fetchProfile(),
    ])
    setPhotos(photosRes.data)
    setHeroUrl(profile.hero_avatar_url ?? null)
    setAboutUrl(profile.about_avatar_url ?? null)
    setLoading(false)
  }

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

  const handleAssign = async (photo: ProfilePhoto, section: 'hero' | 'about') => {
    setAssigning(`${photo.id}:${section}`)
    try {
      await assignPhotoToSection(photo.id, section)
      if (section === 'hero') setHeroUrl(photo.public_url)
      else setAboutUrl(photo.public_url)
      invalidateCache('profile')
    } finally {
      setAssigning(null)
    }
  }

  const handleUnset = async (section: 'hero' | 'about') => {
    setUnsetting(section)
    try {
      await unsetSection(section)
      if (section === 'hero') setHeroUrl(null)
      else setAboutUrl(null)
      invalidateCache('profile')
    } finally {
      setUnsetting(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await apiClient.delete(`/api/profile/photos/${deleteTarget.id}`)
      setPhotos((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      if (heroUrl === deleteTarget.public_url) setHeroUrl(null)
      if (aboutUrl === deleteTarget.public_url) setAboutUrl(null)
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress sx={{ color: '#00B4D8' }} />
    </Box>
  )

  const SectionSlot = ({ section, url, icon, label }: {
    section: 'hero' | 'about'; url: string | null; icon: React.ReactNode; label: string
  }) => (
    <GlassCard hover={false} sx={{ p: 2.5, flex: 1, minWidth: 200 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <Box sx={{ color: '#00B4D8' }}>{icon}</Box>
        <Typography fontWeight={700} color="#E2E8F0" fontSize={14}>{label}</Typography>
      </Box>
      {url ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            p: 0.3, borderRadius: '50%',
            background: 'conic-gradient(from 0deg, #00B4D8, #7C3AED, #00B4D8)',
          }}>
            <Box sx={{ p: 0.25, borderRadius: '50%', bgcolor: '#0A0F1E' }}>
              <Avatar src={url} sx={{ width: 40, height: 40 }} />
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Chip
              icon={<CheckCircleIcon sx={{ fontSize: '12px !important', color: '#10B981 !important' }} />}
              label="Active"
              size="small"
              sx={{ bgcolor: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', height: 20, fontSize: 11 }}
            />
          </Box>
          <Button
            size="small"
            startIcon={unsetting === section ? <CircularProgress size={12} color="inherit" /> : <LinkOffIcon sx={{ fontSize: '14px !important' }} />}
            disabled={!!unsetting}
            onClick={() => handleUnset(section)}
            sx={{
              color: '#64748B', textTransform: 'none', fontSize: 12,
              '&:hover': { color: '#EF4444', bgcolor: 'rgba(239,68,68,0.06)' },
            }}
          >
            Unset
          </Button>
        </Box>
      ) : (
        <Typography variant="caption" color="text.secondary">
          No photo set — pick one below.
        </Typography>
      )}
    </GlassCard>
  )

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} color="#E2E8F0">Profile Photos</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Upload photos and assign them independently to the Hero and About sections.
        </Typography>
      </Box>

      {/* Active section slots */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <SectionSlot section="hero" url={heroUrl} icon={<HomeIcon fontSize="small" />} label="Hero Section" />
        <SectionSlot section="about" url={aboutUrl} icon={<PersonIcon fontSize="small" />} label="About Page" />
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 4 }} />

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
          {photos.map((p) => {
            const isHero = heroUrl === p.public_url
            const isAbout = aboutUrl === p.public_url
            return (
              <GlassCard
                key={p.id}
                hover={false}
                sx={{
                  p: 2.5,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  border: (isHero || isAbout) ? '1px solid rgba(0,180,216,0.3)' : '1px solid rgba(255,255,255,0.05)',
                  background: (isHero || isAbout) ? 'rgba(0,180,216,0.03)' : 'rgba(255,255,255,0.02)',
                  flexWrap: 'wrap', gap: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, overflow: 'hidden', flex: 1 }}>
                  <Avatar
                    src={p.public_url}
                    sx={{
                      width: 48, height: 48, flexShrink: 0, borderRadius: 2,
                      border: (isHero || isAbout) ? '2px solid rgba(0,180,216,0.4)' : '2px solid rgba(255,255,255,0.08)',
                    }}
                  />
                  <Box sx={{ overflow: 'hidden', flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', mb: 0.25 }}>
                      <Typography fontWeight={600} color="#E2E8F0" noWrap sx={{ maxWidth: { xs: 120, md: 280 }, fontSize: 13 }}>
                        {p.storage_path}
                      </Typography>
                      {isHero && (
                        <Chip icon={<HomeIcon sx={{ fontSize: '10px !important' }} />} label="Hero"
                          size="small" sx={{ height: 18, fontSize: 10, bgcolor: 'rgba(0,180,216,0.15)', color: '#00B4D8' }} />
                      )}
                      {isAbout && (
                        <Chip icon={<PersonIcon sx={{ fontSize: '10px !important' }} />} label="About"
                          size="small" sx={{ height: 18, fontSize: 10, bgcolor: 'rgba(124,58,237,0.15)', color: '#A78BFA' }} />
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(p.uploaded_at).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexShrink: 0, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Button
                    component="a" href={p.public_url} target="_blank" rel="noopener noreferrer"
                    size="small"
                    sx={{ color: '#64748B', textTransform: 'none', fontSize: 12, minWidth: 0 }}
                  >
                    View
                  </Button>
                  {!isHero && (
                    <Button
                      size="small" variant="outlined"
                      disabled={!!assigning}
                      onClick={() => handleAssign(p, 'hero')}
                      startIcon={assigning === `${p.id}:hero`
                        ? <CircularProgress size={12} color="inherit" />
                        : <HomeIcon sx={{ fontSize: '14px !important' }} />}
                      sx={{
                        borderColor: 'rgba(0,180,216,0.4)', color: '#00B4D8',
                        textTransform: 'none', fontSize: 12,
                        '&:hover': { borderColor: '#00B4D8', background: 'rgba(0,180,216,0.08)' },
                      }}
                    >
                      Set Hero
                    </Button>
                  )}
                  {!isAbout && (
                    <Button
                      size="small" variant="outlined"
                      disabled={!!assigning}
                      onClick={() => handleAssign(p, 'about')}
                      startIcon={assigning === `${p.id}:about`
                        ? <CircularProgress size={12} color="inherit" />
                        : <PersonIcon sx={{ fontSize: '14px !important' }} />}
                      sx={{
                        borderColor: 'rgba(124,58,237,0.4)', color: '#A78BFA',
                        textTransform: 'none', fontSize: 12,
                        '&:hover': { borderColor: '#A78BFA', background: 'rgba(124,58,237,0.08)' },
                      }}
                    >
                      Set About
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
            )
          })}
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
              {(heroUrl === deleteTarget?.public_url || aboutUrl === deleteTarget?.public_url) && (
                <Box component="span" sx={{ color: '#F59E0B', display: 'block', mt: 0.5, fontSize: 13 }}>
                  ⚠ Currently active in{' '}
                  {heroUrl === deleteTarget?.public_url && aboutUrl === deleteTarget?.public_url
                    ? 'Hero & About'
                    : heroUrl === deleteTarget?.public_url ? 'Hero' : 'About'}.
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
