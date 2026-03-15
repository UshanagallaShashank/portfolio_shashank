import { useEffect, useState } from 'react'
import {
  Box, Typography, CircularProgress, IconButton, Tooltip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Switch, FormControlLabel, Chip, Slider,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import GlassCard from '../../components/ui/GlassCard'
import { fetchAllSkills, toggleSkillVisibility } from '../../api/skills'
import type { Skill } from '../../api/skills'
import apiClient from '../../api/client'

interface SkillForm {
  name: string
  category: string
  icon_url: string
  proficiency: number
  display_order: number
  is_visible: boolean
}

const emptyForm: SkillForm = {
  name: '', category: '', icon_url: '', proficiency: 80, display_order: 0, is_visible: true,
}

export default function AdminSkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<SkillForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [visibilityTarget, setVisibilityTarget] = useState<Skill | null>(null)
  const [toggling, setToggling] = useState(false)

  const load = () => fetchAllSkills().then(setSkills).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditId(null); setForm(emptyForm); setDialogOpen(true) }
  const openEdit = (s: Skill) => {
    setEditId(s.id)
    setForm({
      name: s.name, category: s.category ?? '', icon_url: s.icon_url ?? '',
      proficiency: s.proficiency, display_order: s.display_order, is_visible: s.is_visible,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const payload = { ...form, category: form.category || null, icon_url: form.icon_url || null }
    try {
      if (editId) {
        await apiClient.patch(`/api/skills/${editId}`, payload)
      } else {
        await apiClient.post('/api/skills', payload)
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
      await toggleSkillVisibility(visibilityTarget.id, !visibilityTarget.is_visible)
      setSkills((prev) => prev.map((x) =>
        x.id === visibilityTarget.id ? { ...x, is_visible: !visibilityTarget.is_visible } : x
      ))
      setVisibilityTarget(null)
    } finally {
      setToggling(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return
    await apiClient.delete(`/api/skills/${id}`)
    setSkills((prev) => prev.filter((s) => s.id !== id))
  }

  const categories = Array.from(new Set(skills.map((s) => s.category ?? 'Uncategorized')))

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress sx={{ color: '#00B4D8' }} />
    </Box>
  )

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="#E2E8F0">Skills</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {skills.filter((s) => s.is_visible).length} visible
            {' · '}
            {skills.filter((s) => !s.is_visible).length} hidden
          </Typography>
        </Box>
        <Button startIcon={<AddIcon />} variant="contained" onClick={openCreate}
          sx={{ background: 'linear-gradient(135deg, #00B4D8, #7C3AED)', fontWeight: 700, textTransform: 'none' }}>
          Add Skill
        </Button>
      </Box>

      {categories.map((cat) => (
        <Box key={cat} sx={{ mb: 3 }}>
          <Typography variant="overline" color="text.secondary"
            sx={{ letterSpacing: 2, fontSize: 11, mb: 1, display: 'block' }}>
            {cat}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {skills.filter((s) => (s.category ?? 'Uncategorized') === cat).map((s) => (
              <GlassCard key={s.id} hover={false} sx={{
                p: 2,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                opacity: s.is_visible ? 1 : 0.55,
                border: s.is_visible ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(239,68,68,0.2)',
              }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography fontWeight={600} color="#E2E8F0">{s.name}</Typography>
                    {!s.is_visible && (
                      <Chip label="Hidden" size="small"
                        sx={{ height: 18, fontSize: 10, bgcolor: 'rgba(239,68,68,0.15)', color: '#F87171' }} />
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Box sx={{ height: 4, width: 80, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                      <Box sx={{
                        height: '100%', width: `${s.proficiency}%`,
                        background: 'linear-gradient(90deg, #00B4D8, #7C3AED)', borderRadius: 2,
                      }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary">{s.proficiency}%</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                  <Tooltip title={s.is_visible ? 'Remove from Skills section' : 'Add to Skills section'}>
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
        </Box>
      ))}

      {skills.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
          No skills yet. Add your first skill above.
        </Typography>
      )}

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
          {visibilityTarget?.is_visible ? 'Remove from Skills?' : 'Add to Skills?'}
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {visibilityTarget?.is_visible
              ? <>Visitors will no longer see <strong style={{ color: '#E2E8F0' }}>{visibilityTarget?.name}</strong> in the Skills section.</>
              : <>Visitors will see <strong style={{ color: '#E2E8F0' }}>{visibilityTarget?.name}</strong> in the Skills section.</>
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
          {editId ? 'Edit Skill' : 'New Skill'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          <TextField label="Name" value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} fullWidth size="small" />
          <TextField label="Category" value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            fullWidth size="small" helperText="e.g. Frontend, Backend, DevOps" />
          <TextField label="Icon URL" value={form.icon_url}
            onChange={(e) => setForm((f) => ({ ...f, icon_url: e.target.value }))}
            fullWidth size="small" helperText="Optional — link to an SVG/PNG icon" />
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Proficiency: {form.proficiency}%
            </Typography>
            <Slider
              value={form.proficiency}
              onChange={(_, v) => setForm((f) => ({ ...f, proficiency: v as number }))}
              min={0} max={100} step={5}
              sx={{ color: '#00B4D8' }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField label="Display Order" type="number" value={form.display_order}
              onChange={(e) => setForm((f) => ({ ...f, display_order: Number(e.target.value) }))}
              size="small" sx={{ width: 140 }} />
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
