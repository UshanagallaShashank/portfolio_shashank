import { useEffect, useState } from 'react'
import {
  Box, Typography, CircularProgress, IconButton, Tooltip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Switch, FormControlLabel, Chip, Snackbar, Alert, Select, MenuItem,
  InputLabel, FormControl, Autocomplete,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import WorkIcon from '@mui/icons-material/Work'
import GlassCard from '../../components/ui/GlassCard'
import type { Experience } from '../../api/experience'
import apiClient from '../../api/client'
import { invalidateCache } from '../../hooks/useApiCache'

// ─── Month / Year helpers ──────────────────────────────────────────────────────

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 15 }, (_, i) => String(currentYear - i + 2))

function buildPeriodString(sm: string, sy: string, em: string, ey: string, present: boolean) {
  const start = sm && sy ? `${sm} ${sy}` : sy || sm || ''
  const end = present ? 'Present' : em && ey ? `${em} ${ey}` : ''
  return start && end ? `${start} – ${end}` : start
}

function parsePeriodString(period: string) {
  // Supports "Month YYYY – Month YYYY" or "Month YYYY – Present"
  const parts = period.split(/\s*[–-]\s*/)
  const parseDate = (s: string) => {
    const tokens = s.trim().split(' ')
    if (tokens.length === 2) return { month: tokens[0], year: tokens[1] }
    if (tokens.length === 1 && /^\d{4}$/.test(tokens[0])) return { month: '', year: tokens[0] }
    return { month: '', year: '' }
  }
  const start = parseDate(parts[0] ?? '')
  const endStr = (parts[1] ?? '').trim()
  const isPresent = endStr.toLowerCase() === 'present'
  const end = isPresent ? { month: '', year: '' } : parseDate(endStr)
  return { startMonth: start.month, startYear: start.year, endMonth: end.month, endYear: end.year, isPresent }
}

// ─── Common tech presets ───────────────────────────────────────────────────────

const COMMON_TECH = [
  'Python', 'TypeScript', 'JavaScript', 'Java', 'Go', 'Rust', 'C++',
  'React', 'Next.js', 'Vue.js', 'Angular', 'TailwindCSS', 'MUI',
  'FastAPI', 'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot',
  'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Supabase',
  'LangChain', 'LangGraph', 'RAG', 'Gemini API', 'OpenAI API', 'Google ADK',
  'WebRTC', 'WebSocket', 'REST APIs', 'GraphQL',
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'Playwright',
  'Git', 'n8n', 'Salesforce',
]

// ─── Form types ────────────────────────────────────────────────────────────────

interface ExpForm {
  role: string
  company: string
  location: string
  startMonth: string
  startYear: string
  endMonth: string
  endYear: string
  isPresent: boolean
  type: string
  highlights: string[]
  tech: string[]
  display_order: number
  is_visible: boolean
}

const emptyForm: ExpForm = {
  role: '', company: '', location: '',
  startMonth: '', startYear: '', endMonth: '', endYear: '', isPresent: true,
  type: 'Full-time', highlights: [''], tech: [],
  display_order: 0, is_visible: true,
}

// ─── MonthYearPicker subcomponent ─────────────────────────────────────────────

function MonthYearPicker({
  label, month, year, onMonth, onYear, disabled,
}: {
  label: string; month: string; year: string
  onMonth: (v: string) => void; onYear: (v: string) => void; disabled?: boolean
}) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>{label}</Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <FormControl size="small" sx={{ flex: 1 }} disabled={disabled}>
          <InputLabel sx={{ color: '#64748B' }}>Month</InputLabel>
          <Select value={month} label="Month" onChange={(e) => onMonth(e.target.value)}
            sx={{
              color: '#E2E8F0',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.12)' },
              '& .MuiSvgIcon-root': { color: '#64748B' },
            }}
            MenuProps={{ PaperProps: { sx: { bgcolor: '#0E1426', border: '1px solid rgba(0,180,216,0.15)', maxHeight: 280 } } }}>
            <MenuItem value="" sx={{ color: '#64748B', fontStyle: 'italic' }}>— month —</MenuItem>
            {MONTHS.map((m) => <MenuItem key={m} value={m} sx={{ color: '#E2E8F0' }}>{m}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ width: 100 }} disabled={disabled}>
          <InputLabel sx={{ color: '#64748B' }}>Year</InputLabel>
          <Select value={year} label="Year" onChange={(e) => onYear(e.target.value)}
            sx={{
              color: '#E2E8F0',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.12)' },
              '& .MuiSvgIcon-root': { color: '#64748B' },
            }}
            MenuProps={{ PaperProps: { sx: { bgcolor: '#0E1426', border: '1px solid rgba(0,180,216,0.15)', maxHeight: 240 } } }}>
            <MenuItem value="" sx={{ color: '#64748B', fontStyle: 'italic' }}>— year —</MenuItem>
            {YEARS.map((y) => <MenuItem key={y} value={y} sx={{ color: '#E2E8F0' }}>{y}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>
    </Box>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function AdminExperienceManager() {
  const [items, setItems] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<ExpForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [visibilityTarget, setVisibilityTarget] = useState<Experience | null>(null)
  const [toggling, setToggling] = useState(false)
  const [snack, setSnack] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null)

  const load = () =>
    apiClient.get<Experience[]>('/api/experience/all')
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (e: Experience) => {
    setEditId(e.id)
    const parsed = parsePeriodString(e.period)
    setForm({
      role: e.role, company: e.company, location: e.location,
      ...parsed,
      type: e.type,
      highlights: e.highlights.length ? e.highlights : [''],
      tech: e.tech,
      display_order: e.display_order, is_visible: e.is_visible,
    })
    setDialogOpen(true)
  }

  const setF = <K extends keyof ExpForm>(key: K, value: ExpForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const period = buildPeriodString(form.startMonth, form.startYear, form.endMonth, form.endYear, form.isPresent)
      const payload = {
        role: form.role, company: form.company, location: form.location,
        period, type: form.type,
        highlights: form.highlights.filter((h) => h.trim()),
        tech: form.tech,
        display_order: form.display_order, is_visible: form.is_visible,
      }
      if (editId) {
        await apiClient.patch(`/api/experience/${editId}`, payload)
      } else {
        await apiClient.post('/api/experience', payload)
      }
      setDialogOpen(false)
      setSnack({ msg: 'Saved!', severity: 'success' })
      invalidateCache('experience')
      load()
    } catch {
      setSnack({ msg: 'Save failed. Check backend.', severity: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const confirmToggle = async () => {
    if (!visibilityTarget) return
    setToggling(true)
    try {
      await apiClient.patch(`/api/experience/${visibilityTarget.id}`, { is_visible: !visibilityTarget.is_visible })
      setItems((prev) => prev.map((x) =>
        x.id === visibilityTarget.id ? { ...x, is_visible: !visibilityTarget.is_visible } : x
      ))
      invalidateCache('experience')
      setVisibilityTarget(null)
    } catch {
      setSnack({ msg: 'Failed to update visibility. Is the backend running?', severity: 'error' })
      setVisibilityTarget(null)
    } finally {
      setToggling(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience entry?')) return
    try {
      await apiClient.delete(`/api/experience/${id}`)
      invalidateCache('experience')
      setItems((prev) => prev.filter((x) => x.id !== id))
      setSnack({ msg: 'Deleted.', severity: 'success' })
    } catch {
      setSnack({ msg: 'Delete failed.', severity: 'error' })
    }
  }

  const setHighlight = (idx: number, val: string) =>
    setForm((f) => { const h = [...f.highlights]; h[idx] = val; return { ...f, highlights: h } })
  const addHighlight = () => setForm((f) => ({ ...f, highlights: [...f.highlights, ''] }))
  const removeHighlight = (idx: number) =>
    setForm((f) => ({ ...f, highlights: f.highlights.filter((_, i) => i !== idx) }))

  const toggleTech = (t: string) =>
    setForm((f) => ({
      ...f,
      tech: f.tech.includes(t) ? f.tech.filter((x) => x !== t) : [...f.tech, t],
    }))

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress sx={{ color: '#00B4D8' }} /></Box>

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="#E2E8F0">Experience</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Manage your work history timeline.</Typography>
        </Box>
        <Button startIcon={<AddIcon />} variant="contained" onClick={openCreate}
          sx={{ background: 'linear-gradient(135deg, #00B4D8, #7C3AED)', fontWeight: 700, textTransform: 'none' }}>
          Add Experience
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((exp) => (
          <GlassCard key={exp.id} hover={false} sx={{
            p: 3, opacity: exp.is_visible ? 1 : 0.55,
            border: exp.is_visible ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(239,68,68,0.2)',
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                  <WorkIcon sx={{ fontSize: 16, color: '#00B4D8' }} />
                  <Typography fontWeight={800} sx={{ color: '#E2E8F0', fontSize: 16 }}>{exp.role}</Typography>
                  <Chip label={exp.type} size="small" sx={{
                    height: 18, fontSize: 10,
                    bgcolor: exp.type === 'Full-time' ? 'rgba(16,185,129,0.15)' : 'rgba(0,180,216,0.1)',
                    color: exp.type === 'Full-time' ? '#10B981' : '#00B4D8',
                  }} />
                  {!exp.is_visible && (
                    <Chip label="Hidden" size="small" sx={{ height: 18, fontSize: 10, bgcolor: 'rgba(239,68,68,0.15)', color: '#F87171' }} />
                  )}
                </Box>
                <Typography variant="body2" sx={{ color: '#00B4D8', fontWeight: 600, mb: 0.25 }}>
                  {exp.company} · {exp.location}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>{exp.period}</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                  {exp.tech.map((t) => (
                    <Chip key={t} label={t} size="small" sx={{
                      height: 20, fontSize: '0.68rem',
                      bgcolor: 'rgba(124,58,237,0.1)', color: '#A855F7',
                      border: '1px solid rgba(124,58,237,0.25)',
                    }} />
                  ))}
                </Box>
              </Box>
              {/* Action buttons — no overlapping tooltips */}
              <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0, ml: 2, alignItems: 'center' }}>
                <Tooltip title={exp.is_visible ? 'Hide' : 'Show'} placement="top">
                  <IconButton size="small" onClick={() => setVisibilityTarget(exp)}
                    sx={{ color: exp.is_visible ? '#10B981' : '#64748B' }}>
                    {exp.is_visible ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit" placement="top">
                  <IconButton size="small" onClick={() => openEdit(exp)} sx={{ color: '#94A3B8' }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete" placement="top">
                  <IconButton size="small" onClick={() => handleDelete(exp.id)} sx={{ color: '#EF4444' }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </GlassCard>
        ))}
      </Box>

      {items.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>No experience entries yet.</Typography>
      )}

      {/* Visibility confirm */}
      <Dialog open={!!visibilityTarget} onClose={() => !toggling && setVisibilityTarget(null)}
        PaperProps={{ sx: { bgcolor: '#0E1426', border: '1px solid rgba(0,180,216,0.15)', borderRadius: 3, minWidth: 360 } }}>
        <DialogTitle sx={{ color: '#E2E8F0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {visibilityTarget?.is_visible ? <RemoveCircleOutlineIcon sx={{ color: '#F59E0B' }} /> : <AddCircleOutlineIcon sx={{ color: '#10B981' }} />}
          {visibilityTarget?.is_visible ? 'Hide this entry?' : 'Show this entry?'}
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            <strong style={{ color: '#E2E8F0' }}>{visibilityTarget?.role}</strong> at{' '}
            <strong style={{ color: '#E2E8F0' }}>{visibilityTarget?.company}</strong> will be{' '}
            {visibilityTarget?.is_visible ? 'hidden from' : 'visible to'} visitors.
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

      {/* Edit / Create dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth
        PaperProps={{ sx: { bgcolor: '#0E1426', border: '1px solid rgba(0,180,216,0.2)', borderRadius: 3 } }}>
        <DialogTitle sx={{ color: '#E2E8F0', fontWeight: 700 }}>{editId ? 'Edit Experience' : 'New Experience'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '8px !important' }}>

          {/* Role + Company */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField label="Role / Title" value={form.role}
              onChange={(e) => setF('role', e.target.value)}
              fullWidth size="small" placeholder='e.g. "Developer 1"' />
            <TextField label="Company" value={form.company}
              onChange={(e) => setF('company', e.target.value)}
              fullWidth size="small" />
          </Box>

          {/* Location + Type */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField label="Location" value={form.location}
              onChange={(e) => setF('location', e.target.value)}
              fullWidth size="small" placeholder='e.g. "Hyderabad"' />
            <FormControl size="small" fullWidth>
              <InputLabel sx={{ color: '#64748B' }}>Type</InputLabel>
              <Select label="Type" value={form.type} onChange={(e) => setF('type', e.target.value)}
                sx={{ color: '#E2E8F0', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.12)' }, '& .MuiSvgIcon-root': { color: '#64748B' } }}
                MenuProps={{ PaperProps: { sx: { bgcolor: '#0E1426', border: '1px solid rgba(0,180,216,0.15)' } } }}>
                {['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'].map((t) => (
                  <MenuItem key={t} value={t} sx={{ color: '#E2E8F0' }}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Period — month/year pickers */}
          <Box sx={{ p: 2, borderRadius: 2, border: '1px solid rgba(0,180,216,0.15)', bgcolor: 'rgba(0,180,216,0.03)' }}>
            <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 1.5, fontSize: 11, textTransform: 'uppercase', mb: 1.5, display: 'block' }}>
              Period
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
              <MonthYearPicker
                label="Start"
                month={form.startMonth} year={form.startYear}
                onMonth={(v) => setF('startMonth', v)} onYear={(v) => setF('startYear', v)}
              />
              <Box>
                <MonthYearPicker
                  label="End"
                  month={form.endMonth} year={form.endYear}
                  onMonth={(v) => setF('endMonth', v)} onYear={(v) => setF('endYear', v)}
                  disabled={form.isPresent}
                />
                <FormControlLabel
                  control={<Switch checked={form.isPresent} size="small" color="success"
                    onChange={(e) => setF('isPresent', e.target.checked)} />}
                  label={<Typography variant="caption" color="text.secondary">Currently working here</Typography>}
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>
            {/* Preview */}
            {(form.startMonth || form.startYear) && (
              <Typography variant="caption" sx={{ mt: 1.5, display: 'block', color: '#00B4D8' }}>
                Preview: {buildPeriodString(form.startMonth, form.startYear, form.endMonth, form.endYear, form.isPresent)}
              </Typography>
            )}
          </Box>

          {/* Highlights */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 1.2, fontSize: 11 }}>
              Highlights
            </Typography>
            {form.highlights.map((h, idx) => (
              <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  value={h}
                  onChange={(e) => setHighlight(idx, e.target.value)}
                  fullWidth size="small" placeholder={`Highlight ${idx + 1}`}
                  multiline maxRows={3}
                />
                <IconButton size="small" onClick={() => removeHighlight(idx)} disabled={form.highlights.length === 1}
                  sx={{ color: '#EF4444', alignSelf: 'center', flexShrink: 0 }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
            <Button size="small" startIcon={<AddIcon />} onClick={addHighlight}
              sx={{ color: '#00B4D8', textTransform: 'none', mt: 0.5 }}>
              Add Highlight
            </Button>
          </Box>

          {/* Tech picker */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 1.2, fontSize: 11 }}>
              Tech Stack
            </Typography>
            {/* Preset chips */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.5 }}>
              {COMMON_TECH.map((t) => {
                const selected = form.tech.includes(t)
                return (
                  <Chip
                    key={t} label={t} size="small"
                    onClick={() => toggleTech(t)}
                    sx={{
                      cursor: 'pointer', fontSize: '0.72rem',
                      bgcolor: selected ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.04)',
                      color: selected ? '#C084FC' : '#64748B',
                      border: selected ? '1px solid rgba(124,58,237,0.5)' : '1px solid rgba(255,255,255,0.08)',
                      '&:hover': { bgcolor: selected ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.08)' },
                      transition: 'all 0.15s',
                    }}
                  />
                )
              })}
            </Box>
            {/* Add custom tech */}
            <Autocomplete
              multiple freeSolo
              options={COMMON_TECH.filter((t) => !form.tech.includes(t))}
              value={form.tech}
              onChange={(_, value) => setF('tech', value as string[])}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip label={option} size="small" {...getTagProps({ index })} key={option}
                    sx={{ bgcolor: 'rgba(124,58,237,0.2)', color: '#C084FC', border: '1px solid rgba(124,58,237,0.4)' }} />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} size="small" placeholder="Type to search or add custom tech…"
                  helperText="Click chips above or type here to add custom technologies" />
              )}
              ChipProps={{ size: 'small' } as any}
              sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.12)' } }}
            />
          </Box>

          {/* Order + Visibility */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField label="Order" type="number" value={form.display_order}
              onChange={(e) => setF('display_order', Number(e.target.value))}
              size="small" sx={{ width: 100 }} />
            <FormControlLabel
              control={<Switch checked={form.is_visible} color="success"
                onChange={(e) => setF('is_visible', e.target.checked)} />}
              label="Visible on portfolio" />
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
