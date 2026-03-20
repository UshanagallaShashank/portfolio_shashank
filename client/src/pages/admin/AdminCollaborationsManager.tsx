import { useEffect, useState } from 'react'
import {
  Box, Typography, CircularProgress, IconButton, Tooltip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Switch, FormControlLabel, Chip, Snackbar, Alert, Select, MenuItem,
  InputLabel, FormControl,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import LinkIcon from '@mui/icons-material/Link'
import GlassCard from '../../components/ui/GlassCard'
import type { Collaboration } from '../../api/collaborations'
import apiClient from '../../api/client'
import { invalidateCache } from '../../hooks/useApiCache'

const ICON_OPTIONS = ['SmartToy', 'Code', 'Handshake', 'OpenInNew', 'Link']
const COLOR_PRESETS = ['#00B4D8', '#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#EC4899']

interface CollabForm {
  title: string
  description: string
  link: string
  link_label: string
  color: string
  icon: string
  display_order: number
  is_visible: boolean
}

const emptyForm: CollabForm = {
  title: '', description: '', link: '', link_label: '',
  color: '#00B4D8', icon: 'Handshake',
  display_order: 0, is_visible: true,
}

export default function AdminCollaborationsManager() {
  const [items, setItems] = useState<Collaboration[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<CollabForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [visibilityTarget, setVisibilityTarget] = useState<Collaboration | null>(null)
  const [toggling, setToggling] = useState(false)
  const [snack, setSnack] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null)

  const load = () =>
    apiClient.get<Collaboration[]>('/api/collaborations/all')
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditId(null); setForm(emptyForm); setDialogOpen(true) }
  const openEdit = (c: Collaboration) => {
    setEditId(c.id)
    setForm({
      title: c.title, description: c.description,
      link: c.link ?? '', link_label: c.link_label ?? '',
      color: c.color, icon: c.icon,
      display_order: c.display_order, is_visible: c.is_visible,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        ...form,
        link: form.link.trim() || null,
        link_label: form.link_label.trim() || null,
      }
      if (editId) {
        await apiClient.patch(`/api/collaborations/${editId}`, payload)
      } else {
        await apiClient.post('/api/collaborations', payload)
      }
      setDialogOpen(false)
      setSnack({ msg: 'Saved!', severity: 'success' })
      invalidateCache('collaborations')
      load()
    } catch {
      setSnack({ msg: 'Save failed.', severity: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const confirmToggle = async () => {
    if (!visibilityTarget) return
    setToggling(true)
    try {
      await apiClient.patch(`/api/collaborations/${visibilityTarget.id}`, { is_visible: !visibilityTarget.is_visible })
      setItems((prev) => prev.map((x) =>
        x.id === visibilityTarget.id ? { ...x, is_visible: !visibilityTarget.is_visible } : x
      ))
      invalidateCache('collaborations')
      setVisibilityTarget(null)
    } finally {
      setToggling(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this collaboration entry?')) return
    try {
      await apiClient.delete(`/api/collaborations/${id}`)
      invalidateCache('collaborations')
      setItems((prev) => prev.filter((x) => x.id !== id))
      setSnack({ msg: 'Deleted.', severity: 'success' })
    } catch {
      setSnack({ msg: 'Delete failed.', severity: 'error' })
    }
  }

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress sx={{ color: '#00B4D8' }} /></Box>

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} color="#E2E8F0">Collaborations</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Manage service cards and project highlights on the Collaboration page.
          Items <strong>without a link</strong> appear as service cards; items <strong>with a link</strong> appear as project highlights.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button startIcon={<AddIcon />} variant="contained" onClick={openCreate}
          sx={{ background: 'linear-gradient(135deg, #00B4D8, #7C3AED)', fontWeight: 700, textTransform: 'none' }}>
          Add Item
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {items.map((c) => (
          <GlassCard key={c.id} hover={false} sx={{
            p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            opacity: c.is_visible ? 1 : 0.55,
            border: c.is_visible ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(239,68,68,0.2)',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c.color, flexShrink: 0 }} />
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography fontWeight={700} sx={{ color: '#E2E8F0' }}>{c.title}</Typography>
                  <Chip label={c.link ? 'Project' : 'Service'} size="small" sx={{
                    height: 18, fontSize: 10,
                    bgcolor: c.link ? 'rgba(245,158,11,0.15)' : 'rgba(0,180,216,0.15)',
                    color: c.link ? '#F59E0B' : '#00B4D8',
                  }} />
                  {!c.is_visible && (
                    <Chip label="Hidden" size="small" sx={{ height: 18, fontSize: 10, bgcolor: 'rgba(239,68,68,0.15)', color: '#F87171' }} />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500 }}>{c.description}</Typography>
                {c.link && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                    <LinkIcon sx={{ fontSize: 12, color: '#00B4D8' }} />
                    <Typography variant="caption" sx={{ color: '#00B4D8' }}>{c.link}</Typography>
                  </Box>
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
              <Tooltip title={c.is_visible ? 'Hide' : 'Show'}>
                <IconButton size="small" onClick={() => setVisibilityTarget(c)}
                  sx={{ color: c.is_visible ? '#10B981' : '#64748B' }}>
                  {c.is_visible ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton size="small" onClick={() => openEdit(c)} sx={{ color: '#94A3B8' }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton size="small" onClick={() => handleDelete(c.id)} sx={{ color: '#EF4444' }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </GlassCard>
        ))}
      </Box>

      {items.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>No collaboration items yet.</Typography>
      )}

      {/* Visibility confirm */}
      <Dialog open={!!visibilityTarget} onClose={() => !toggling && setVisibilityTarget(null)}
        PaperProps={{ sx: { bgcolor: '#0E1426', border: '1px solid rgba(0,180,216,0.15)', borderRadius: 3, minWidth: 360 } }}>
        <DialogTitle sx={{ color: '#E2E8F0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {visibilityTarget?.is_visible ? <RemoveCircleOutlineIcon sx={{ color: '#F59E0B' }} /> : <AddCircleOutlineIcon sx={{ color: '#10B981' }} />}
          {visibilityTarget?.is_visible ? 'Hide this item?' : 'Show this item?'}
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            <strong style={{ color: '#E2E8F0' }}>{visibilityTarget?.title}</strong> will be {visibilityTarget?.is_visible ? 'hidden from' : 'visible to'} visitors.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setVisibilityTarget(null)} disabled={toggling} sx={{ color: '#64748B', textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" onClick={confirmToggle} disabled={toggling}
            startIcon={toggling ? <CircularProgress size={16} color="inherit" /> : undefined}
            sx={{ textTransform: 'none', fontWeight: 700, background: visibilityTarget?.is_visible ? 'linear-gradient(135deg, #F59E0B, #EF4444)' : 'linear-gradient(135deg, #10B981, #00B4D8)' }}>
            {toggling ? 'Saving...' : visibilityTarget?.is_visible ? 'Hide' : 'Show'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit / Create */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { bgcolor: '#0E1426', border: '1px solid rgba(0,180,216,0.2)', borderRadius: 3 } }}>
        <DialogTitle sx={{ color: '#E2E8F0', fontWeight: 700 }}>{editId ? 'Edit Item' : 'New Item'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          <TextField label="Title" value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            fullWidth size="small" helperText='e.g. "AI Integration"' />
          <TextField label="Description" value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            fullWidth size="small" multiline rows={3} />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField label="Link URL (optional)" value={form.link}
              onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
              fullWidth size="small" helperText="Leave blank for service card" />
            <TextField label="Link Label" value={form.link_label}
              onChange={(e) => setForm((f) => ({ ...f, link_label: e.target.value }))}
              fullWidth size="small" helperText='e.g. "View Project"' />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <FormControl size="small" fullWidth>
              <InputLabel sx={{ color: '#64748B' }}>Icon</InputLabel>
              <Select label="Icon" value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                sx={{ color: '#E2E8F0', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.12)' } }}>
                {ICON_OPTIONS.map((ico) => <MenuItem key={ico} value={ico}>{ico}</MenuItem>)}
              </Select>
            </FormControl>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Color</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {COLOR_PRESETS.map((col) => (
                  <Box
                    key={col}
                    onClick={() => setForm((f) => ({ ...f, color: col }))}
                    sx={{
                      width: 24, height: 24, borderRadius: '50%', bgcolor: col, cursor: 'pointer',
                      border: form.color === col ? '2px solid #fff' : '2px solid transparent',
                      transition: 'border 0.15s',
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField label="Order" type="number" value={form.display_order}
              onChange={(e) => setForm((f) => ({ ...f, display_order: Number(e.target.value) }))}
              size="small" sx={{ width: 100 }} />
            <FormControlLabel
              control={<Switch checked={form.is_visible} color="success"
                onChange={(e) => setForm((f) => ({ ...f, is_visible: e.target.checked }))} />}
              label="Visible" />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#64748B', textTransform: 'none' }}>Cancel</Button>
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
