import { useEffect, useState } from 'react'
import {
  Box, Typography, CircularProgress, IconButton, Tooltip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Switch, FormControlLabel, Chip,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import GlassCard from '../../components/ui/GlassCard'
import type { Stat } from '../../api/stats'
import apiClient from '../../api/client'

interface StatForm {
  label: string
  value: string
  display_order: number
  is_visible: boolean
}

const emptyForm: StatForm = { label: '', value: '', display_order: 0, is_visible: true }

export default function AdminStatsManager() {
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<StatForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [visibilityTarget, setVisibilityTarget] = useState<Stat | null>(null)
  const [toggling, setToggling] = useState(false)

  const load = () =>
    apiClient.get<Stat[]>('/api/stats/all').then((r) => setStats(r.data)).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditId(null); setForm(emptyForm); setDialogOpen(true) }
  const openEdit = (s: Stat) => {
    setEditId(s.id)
    setForm({ label: s.label, value: s.value, display_order: s.display_order, is_visible: s.is_visible })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editId) {
        await apiClient.patch(`/api/stats/${editId}`, form)
      } else {
        await apiClient.post('/api/stats', form)
      }
      setDialogOpen(false)
      load()
    } finally {
      setSaving(false)
    }
  }

  const confirmToggle = async () => {
    if (!visibilityTarget) return
    setToggling(true)
    try {
      await apiClient.patch(`/api/stats/${visibilityTarget.id}`, { is_visible: !visibilityTarget.is_visible })
      setStats((prev) => prev.map((x) =>
        x.id === visibilityTarget.id ? { ...x, is_visible: !visibilityTarget.is_visible } : x
      ))
      setVisibilityTarget(null)
    } finally {
      setToggling(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this stat?')) return
    await apiClient.delete(`/api/stats/${id}`)
    setStats((prev) => prev.filter((s) => s.id !== id))
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
          <Typography variant="h4" fontWeight={800} color="#E2E8F0">Stats & Highlights</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Edit the numbers shown on the homepage (350+, LeetCode %, etc.)
          </Typography>
        </Box>
        <Button startIcon={<AddIcon />} variant="contained" onClick={openCreate}
          sx={{ background: 'linear-gradient(135deg, #00B4D8, #7C3AED)', fontWeight: 700, textTransform: 'none' }}>
          Add Stat
        </Button>
      </Box>

      {/* Preview */}
      {stats.filter((s) => s.is_visible).length > 0 && (
        <GlassCard hover={false} sx={{ p: 3, mb: 3, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {stats.filter((s) => s.is_visible).map((s) => (
            <Box key={s.id}>
              <Typography fontWeight={800} sx={{ fontSize: 28, color: '#00B4D8' }}>{s.value}</Typography>
              <Typography variant="caption" color="text.secondary">{s.label}</Typography>
            </Box>
          ))}
        </GlassCard>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {stats.map((s) => (
          <GlassCard key={s.id} hover={false} sx={{
            p: 2.5,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            opacity: s.is_visible ? 1 : 0.55,
            border: s.is_visible ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(239,68,68,0.2)',
          }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
                <Typography fontWeight={800} sx={{ fontSize: 22, color: '#00B4D8' }}>{s.value}</Typography>
                <Typography fontWeight={600} color="#E2E8F0">{s.label}</Typography>
                {!s.is_visible && (
                  <Chip label="Hidden" size="small"
                    sx={{ height: 18, fontSize: 10, bgcolor: 'rgba(239,68,68,0.15)', color: '#F87171' }} />
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
              <Tooltip title={s.is_visible ? 'Remove from homepage' : 'Show on homepage'}>
                <IconButton size="small" onClick={() => setVisibilityTarget(s)}
                  sx={{ color: s.is_visible ? '#10B981' : '#64748B' }}>
                  {s.is_visible ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton size="small" onClick={() => openEdit(s)} sx={{ color: '#94A3B8' }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton size="small" onClick={() => handleDelete(s.id)} sx={{ color: '#EF4444' }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </GlassCard>
        ))}
      </Box>

      {stats.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
          No stats yet. Add your first highlight above.
        </Typography>
      )}

      {/* Visibility confirm */}
      <Dialog
        open={!!visibilityTarget}
        onClose={() => !toggling && setVisibilityTarget(null)}
        PaperProps={{ sx: { bgcolor: '#0E1426', border: '1px solid rgba(0,180,216,0.15)', borderRadius: 3, minWidth: 360 } }}
      >
        <DialogTitle sx={{ color: '#E2E8F0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {visibilityTarget?.is_visible
            ? <RemoveCircleOutlineIcon sx={{ color: '#F59E0B' }} />
            : <AddCircleOutlineIcon sx={{ color: '#10B981' }} />}
          {visibilityTarget?.is_visible ? 'Remove from homepage?' : 'Show on homepage?'}
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {visibilityTarget?.is_visible
              ? <>The stat <strong style={{ color: '#E2E8F0' }}>{visibilityTarget?.value} {visibilityTarget?.label}</strong> will be hidden from visitors.</>
              : <>The stat <strong style={{ color: '#E2E8F0' }}>{visibilityTarget?.value} {visibilityTarget?.label}</strong> will be visible to visitors.</>
            }
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setVisibilityTarget(null)} disabled={toggling}
            sx={{ color: '#64748B', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={confirmToggle} disabled={toggling}
            startIcon={toggling ? <CircularProgress size={16} color="inherit" /> : undefined}
            sx={{
              textTransform: 'none', fontWeight: 700,
              background: visibilityTarget?.is_visible
                ? 'linear-gradient(135deg, #F59E0B, #EF4444)'
                : 'linear-gradient(135deg, #10B981, #00B4D8)',
            }}>
            {toggling ? 'Saving...' : visibilityTarget?.is_visible ? 'Remove' : 'Show'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit / Create */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { bgcolor: '#0E1426', border: '1px solid rgba(0,180,216,0.2)', borderRadius: 3 } }}>
        <DialogTitle sx={{ color: '#E2E8F0', fontWeight: 700 }}>
          {editId ? 'Edit Stat' : 'New Stat'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          <TextField label="Value" value={form.value}
            onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
            fullWidth size="small" helperText='e.g. "350+", "Top 9.5%", "4★"' />
          <TextField label="Label" value={form.label}
            onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            fullWidth size="small" helperText='e.g. "Problems Solved", "LeetCode Global"' />
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
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}
            sx={{ background: 'linear-gradient(135deg, #00B4D8, #7C3AED)', fontWeight: 700, textTransform: 'none' }}>
            {saving ? <CircularProgress size={18} color="inherit" /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
