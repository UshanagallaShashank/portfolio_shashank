import { useEffect, useState } from 'react'
import {
  Box, Typography, CircularProgress, IconButton, Tooltip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Switch, FormControlLabel, Chip, Slider, Snackbar, Alert,
  Select, MenuItem, InputLabel, FormControl,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import CategoryIcon from '@mui/icons-material/Category'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import GlassCard from '../../components/ui/GlassCard'
import { fetchAllSkills, toggleSkillVisibility } from '../../api/skills'
import type { Skill } from '../../api/skills'
import apiClient from '../../api/client'
import { invalidateCache } from '../../hooks/useApiCache'

interface SkillForm {
  name: string
  category: string
  icon_url: string
  proficiency: number
  display_order: number
  is_visible: boolean
}

const emptyForm = (category = ''): SkillForm => ({
  name: '', category, icon_url: '', proficiency: 80, display_order: 0, is_visible: true,
})

export default function AdminSkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<SkillForm>(emptyForm())
  const [saving, setSaving] = useState(false)
  const [visibilityTarget, setVisibilityTarget] = useState<Skill | null>(null)
  const [toggling, setToggling] = useState(false)
  const [snack, setSnack] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null)

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [extraCategories, setExtraCategories] = useState<string[]>([])
  const [newCatDialog, setNewCatDialog] = useState(false)
  const [newCatName, setNewCatName] = useState('')

  const load = () => fetchAllSkills().then(setSkills).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  // All categories: derived from skills + any manually created ones
  const dbCategories = Array.from(new Set(skills.map((s) => s.category ?? 'Uncategorized')))
  const allCategories = Array.from(new Set([...dbCategories, ...extraCategories]))

  const visibleSkills = selectedCategory === 'All'
    ? skills
    : skills.filter((s) => (s.category ?? 'Uncategorized') === selectedCategory)

  const displayCategories = selectedCategory === 'All' ? allCategories : [selectedCategory]

  const openCreate = () => {
    setEditId(null)
    setForm(emptyForm(selectedCategory === 'All' ? '' : selectedCategory))
    setDialogOpen(true)
  }

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
      invalidateCache('skills')
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
      await toggleSkillVisibility(visibilityTarget.id, !visibilityTarget.is_visible)
      invalidateCache('skills')
      setSkills((prev) => prev.map((x) =>
        x.id === visibilityTarget.id ? { ...x, is_visible: !visibilityTarget.is_visible } : x
      ))
      setVisibilityTarget(null)
    } catch {
      setSnack({ msg: 'Failed to update visibility. Is the backend running and Supabase connected?', severity: 'error' })
      setVisibilityTarget(null)
    } finally {
      setToggling(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return
    try {
      await apiClient.delete(`/api/skills/${id}`)
      invalidateCache('skills')
      setSkills((prev) => prev.filter((s) => s.id !== id))
      setSnack({ msg: 'Deleted.', severity: 'success' })
    } catch {
      setSnack({ msg: 'Delete failed.', severity: 'error' })
    }
  }

  const handleCreateCategory = () => {
    const name = newCatName.trim()
    if (!name) return
    if (!allCategories.includes(name)) {
      setExtraCategories((prev) => [...prev, name])
    }
    setSelectedCategory(name)
    setNewCatDialog(false)
    setNewCatName('')
  }

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress sx={{ color: '#00B4D8' }} />
    </Box>
  )

  return (
    <Box>
      {/* Header row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="#E2E8F0">Skills</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {skills.filter((s) => s.is_visible).length} visible · {skills.filter((s) => !s.is_visible).length} hidden
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            startIcon={<CategoryIcon />}
            variant="outlined"
            onClick={() => setNewCatDialog(true)}
            sx={{
              borderColor: 'rgba(0,180,216,0.4)', color: '#00B4D8', textTransform: 'none', fontWeight: 600,
              '&:hover': { borderColor: '#00B4D8', bgcolor: 'rgba(0,180,216,0.08)' },
            }}
          >
            Create Category
          </Button>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={openCreate}
            sx={{ background: 'linear-gradient(135deg, #00B4D8, #7C3AED)', fontWeight: 700, textTransform: 'none' }}
          >
            Add Skill
          </Button>
        </Box>
      </Box>

      {/* Category filter dropdown */}
      <FormControl size="small" sx={{ mb: 3, minWidth: 220 }}>
        <InputLabel sx={{ color: '#64748B' }}>Category</InputLabel>
        <Select
          value={selectedCategory}
          label="Category"
          onChange={(e) => setSelectedCategory(e.target.value)}
          sx={{
            color: '#E2E8F0',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.12)' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,180,216,0.4)' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00B4D8' },
            '& .MuiSvgIcon-root': { color: '#64748B' },
          }}
          MenuProps={{ PaperProps: { sx: { bgcolor: '#0E1426', border: '1px solid rgba(0,180,216,0.15)' } } }}
        >
          <MenuItem value="All" sx={{ color: '#E2E8F0' }}>All Categories</MenuItem>
          {allCategories.map((cat) => (
            <MenuItem key={cat} value={cat} sx={{ color: '#E2E8F0' }}>{cat}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Skills list grouped by category */}
      {displayCategories.map((cat) => {
        const catSkills = visibleSkills.filter((s) => (s.category ?? 'Uncategorized') === cat)
        if (selectedCategory === 'All' && catSkills.length === 0) return null
        return (
          <Box key={cat} sx={{ mb: 3 }}>
            <Typography variant="overline" color="text.secondary"
              sx={{ letterSpacing: 2, fontSize: 11, mb: 1, display: 'block' }}>
              {cat}
            </Typography>
            {catSkills.length === 0 ? (
              <Box sx={{
                border: '1px dashed rgba(0,180,216,0.2)', borderRadius: 2, py: 3,
                textAlign: 'center', color: '#64748B', fontSize: 13,
              }}>
                No skills yet in this category. Click <strong>Add Skill</strong> to add one.
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {catSkills.map((s) => (
                  <GlassCard key={s.id} hover={false} sx={{
                    p: 2,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    opacity: s.is_visible ? 1 : 0.55,
                    border: s.is_visible ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(239,68,68,0.2)',
                  }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {s.icon_url && (
                          <Typography fontSize={18} lineHeight={1}>{s.icon_url}</Typography>
                        )}
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
            )}
          </Box>
        )
      })}

      {visibleSkills.length === 0 && selectedCategory === 'All' && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
          No skills yet. Add your first skill above.
        </Typography>
      )}

      {/* Create Category dialog */}
      <Dialog open={newCatDialog} onClose={() => setNewCatDialog(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { bgcolor: '#0E1426', border: '1px solid rgba(0,180,216,0.2)', borderRadius: 3 } }}>
        <DialogTitle sx={{ color: '#E2E8F0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CategoryIcon sx={{ color: '#00B4D8' }} /> Create Category
        </DialogTitle>
        <DialogContent sx={{ pt: '8px !important' }}>
          <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
            Enter a name for the new skill category. You can then add skills to it.
          </Typography>
          <TextField
            label="Category Name"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
            fullWidth size="small" autoFocus
            placeholder="e.g. DevOps, Mobile, Testing"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => { setNewCatDialog(false); setNewCatName('') }}
            sx={{ color: '#64748B', textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateCategory} disabled={!newCatName.trim()}
            sx={{ background: 'linear-gradient(135deg, #00B4D8, #7C3AED)', fontWeight: 700, textTransform: 'none' }}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

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

      {/* Edit / Create skill dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { bgcolor: '#0E1426', border: '1px solid rgba(0,180,216,0.2)', borderRadius: 3 } }}>
        <DialogTitle sx={{ color: '#E2E8F0', fontWeight: 700 }}>
          {editId ? 'Edit Skill' : 'New Skill'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          <TextField label="Name" value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} fullWidth size="small" />
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: '#64748B' }}>Category</InputLabel>
            <Select
              value={form.category}
              label="Category"
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              sx={{
                color: '#E2E8F0',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.12)' },
                '& .MuiSvgIcon-root': { color: '#64748B' },
              }}
              MenuProps={{ PaperProps: { sx: { bgcolor: '#0E1426', border: '1px solid rgba(0,180,216,0.15)' } } }}
            >
              {allCategories.map((cat) => (
                <MenuItem key={cat} value={cat} sx={{ color: '#E2E8F0' }}>{cat}</MenuItem>
              ))}
              <MenuItem value="" sx={{ color: '#64748B', fontStyle: 'italic' }}>None / Uncategorized</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Icon (emoji or URL)" value={form.icon_url}
            onChange={(e) => setForm((f) => ({ ...f, icon_url: e.target.value }))}
            fullWidth size="small" helperText="Paste an emoji (e.g. 🐍) or an icon image URL" />
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

      <Snackbar open={!!snack} autoHideDuration={4000} onClose={() => setSnack(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnack(null)} severity={snack?.severity ?? 'info'} sx={{ width: '100%' }}>
          {snack?.msg}
        </Alert>
      </Snackbar>
    </Box>
  )
}
