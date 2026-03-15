import { useEffect, useState } from 'react'
import {
  Box, Typography, CircularProgress, IconButton, Tooltip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Switch, FormControlLabel, Chip, Snackbar, Alert,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import GlassCard from '../../components/ui/GlassCard'
import { fetchAllProjects, toggleProjectVisibility } from '../../api/projects'
import type { Project } from '../../api/projects'
import apiClient from '../../api/client'
import { invalidateCache } from '../../hooks/useApiCache'

interface ProjectForm {
  title: string
  description: string
  tech_stack: string
  github_url: string
  live_url: string
  thumbnail_url: string
  is_featured: boolean
  is_visible: boolean
  display_order: number
}

const emptyForm: ProjectForm = {
  title: '', description: '', tech_stack: '', github_url: '',
  live_url: '', thumbnail_url: '', is_featured: false, is_visible: true, display_order: 0,
}

export default function AdminProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<ProjectForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [visibilityTarget, setVisibilityTarget] = useState<Project | null>(null)
  const [toggling, setToggling] = useState(false)
  const [snack, setSnack] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null)

  const load = () => fetchAllProjects().then(setProjects).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditId(null); setForm(emptyForm); setDialogOpen(true) }
  const openEdit = (p: Project) => {
    setEditId(p.id)
    setForm({
      title: p.title, description: p.description ?? '',
      tech_stack: p.tech_stack.join(', '), github_url: p.github_url ?? '',
      live_url: p.live_url ?? '', thumbnail_url: p.thumbnail_url ?? '',
      is_featured: p.is_featured, is_visible: p.is_visible, display_order: p.display_order,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const payload = { ...form, tech_stack: form.tech_stack.split(',').map((s: string) => s.trim()).filter(Boolean) }
    try {
      if (editId) {
        await apiClient.patch(`/api/projects/${editId}`, payload)
      } else {
        await apiClient.post('/api/projects', payload)
      }
      setDialogOpen(false)
      invalidateCache('projects')
      setSnack({ msg: 'Saved!', severity: 'success' })
      load()
    } catch {
      setSnack({ msg: 'Save failed. Ensure Supabase grants are applied (see schema SQL).', severity: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const confirmToggle = async () => {
    if (!visibilityTarget) return
    setToggling(true)
    try {
      await toggleProjectVisibility(visibilityTarget.id, !visibilityTarget.is_visible)
      invalidateCache('projects')
      setProjects((prev) => prev.map((x) =>
        x.id === visibilityTarget.id ? { ...x, is_visible: !visibilityTarget.is_visible } : x
      ))
      setVisibilityTarget(null)
    } finally {
      setToggling(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return
    try {
      await apiClient.delete(`/api/projects/${id}`)
      invalidateCache('projects')
      setProjects((prev) => prev.filter((p) => p.id !== id))
      setSnack({ msg: 'Deleted.', severity: 'success' })
    } catch {
      setSnack({ msg: 'Delete failed.', severity: 'error' })
    }
  }

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress sx={{ color: '#00B4D8' }} />
    </Box>
  )

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="#E2E8F0">Projects</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {projects.filter((p) => p.is_visible).length} visible
            {' · '}
            {projects.filter((p) => !p.is_visible).length} hidden
          </Typography>
        </Box>
        <Button startIcon={<AddIcon />} variant="contained" onClick={openCreate}
          sx={{ background: 'linear-gradient(135deg, #00B4D8, #7C3AED)', fontWeight: 700, textTransform: 'none' }}>
          Add Project
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {projects.map((p) => (
          <GlassCard key={p.id} hover={false} sx={{
            p: 2.5,
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            opacity: p.is_visible ? 1 : 0.55,
            border: p.is_visible ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(239,68,68,0.2)',
          }}>
            <Box sx={{ overflow: 'hidden', flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography fontWeight={700} color="#E2E8F0">{p.title}</Typography>
                {p.is_featured && (
                  <Chip label="Featured" size="small"
                    sx={{ height: 18, fontSize: 10, bgcolor: 'rgba(124,58,237,0.2)', color: '#A78BFA' }} />
                )}
                {!p.is_visible && (
                  <Chip label="Hidden" size="small"
                    sx={{ height: 18, fontSize: 10, bgcolor: 'rgba(239,68,68,0.15)', color: '#F87171' }} />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 500 }}>
                {p.description}
              </Typography>
              <Typography variant="caption" color="#00B4D8" sx={{ mt: 0.5, display: 'block' }}>
                {p.tech_stack.join(' · ')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5, ml: 2, flexShrink: 0, alignItems: 'center' }}>
              <Tooltip title={p.is_visible ? 'Remove from Projects section' : 'Add to Projects section'}>
                <IconButton size="small" onClick={() => setVisibilityTarget(p)}
                  sx={{ color: p.is_visible ? '#10B981' : '#64748B' }}>
                  {p.is_visible ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton size="small" onClick={() => openEdit(p)} sx={{ color: '#94A3B8' }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton size="small" onClick={() => handleDelete(p.id)} sx={{ color: '#EF4444' }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </GlassCard>
        ))}
      </Box>

      {/* Visibility confirm dialog */}
      <Dialog
        open={!!visibilityTarget}
        onClose={() => !toggling && setVisibilityTarget(null)}
        PaperProps={{ sx: { bgcolor: '#0E1426', border: '1px solid rgba(0,180,216,0.15)', borderRadius: 3, minWidth: 360 } }}
      >
        <DialogTitle sx={{ color: '#E2E8F0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {visibilityTarget?.is_visible
            ? <RemoveCircleOutlineIcon sx={{ color: '#F59E0B' }} />
            : <AddCircleOutlineIcon sx={{ color: '#10B981' }} />}
          {visibilityTarget?.is_visible ? 'Remove from Projects?' : 'Add to Projects?'}
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {visibilityTarget?.is_visible
              ? <>Visitors will no longer see <strong style={{ color: '#E2E8F0' }}>{visibilityTarget?.title}</strong> in the Projects section.</>
              : <>Visitors will see <strong style={{ color: '#E2E8F0' }}>{visibilityTarget?.title}</strong> in the Projects section.</>
            }
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setVisibilityTarget(null)} disabled={toggling}
            sx={{ color: '#64748B', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmToggle}
            disabled={toggling}
            startIcon={toggling ? <CircularProgress size={16} color="inherit" /> : undefined}
            sx={{
              textTransform: 'none', fontWeight: 700,
              background: visibilityTarget?.is_visible
                ? 'linear-gradient(135deg, #F59E0B, #EF4444)'
                : 'linear-gradient(135deg, #10B981, #00B4D8)',
            }}
          >
            {toggling ? 'Saving...' : visibilityTarget?.is_visible ? 'Remove' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit / Create dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { bgcolor: '#0E1426', border: '1px solid rgba(0,180,216,0.2)', borderRadius: 3 } }}>
        <DialogTitle sx={{ color: '#E2E8F0', fontWeight: 700 }}>
          {editId ? 'Edit Project' : 'New Project'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          {(['title', 'description', 'tech_stack', 'github_url', 'live_url', 'thumbnail_url'] as const).map((field) => (
            <TextField
              key={field}
              label={field.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              value={form[field]}
              onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
              fullWidth size="small"
              helperText={field === 'tech_stack' ? 'Comma-separated (e.g. React, Python)' : undefined}
            />
          ))}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField label="Display Order" type="number" value={form.display_order}
              onChange={(e) => setForm((f) => ({ ...f, display_order: Number(e.target.value) }))}
              size="small" sx={{ width: 140 }} />
            <FormControlLabel
              control={<Switch checked={form.is_featured}
                onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))} />}
              label="Featured" />
            <FormControlLabel
              control={<Switch checked={form.is_visible} color="success"
                onChange={(e) => setForm((f) => ({ ...f, is_visible: e.target.checked }))} />}
              label="Visible" />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}
            sx={{ background: 'linear-gradient(135deg, #00B4D8, #7C3AED)', fontWeight: 700, textTransform: 'none' }}>
            {saving ? <CircularProgress size={18} color="inherit" /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={4000} onClose={() => setSnack(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnack(null)} severity={snack?.severity ?? 'info'} sx={{ width: '100%' }}>
          {snack?.msg}
        </Alert>
      </Snackbar>
    </Box>
  )
}
