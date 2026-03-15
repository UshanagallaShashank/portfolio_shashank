import { useEffect, useState } from 'react'
import {
  Box, Typography, CircularProgress, IconButton, Tooltip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Switch, FormControlLabel, Chip, Tabs, Tab, Snackbar, Alert,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import GlassCard from '../../components/ui/GlassCard'
import type { Achievement, Certification } from '../../api/achievements'
import apiClient from '../../api/client'
import { invalidateCache } from '../../hooks/useApiCache'

// ─── Achievements ──────────────────────────────────────────────────────────────

interface AchForm { label: string; detail: string; icon: string; display_order: number; is_visible: boolean }
const emptyAch: AchForm = { label: '', detail: '', icon: '🏆', display_order: 0, is_visible: true }

function AchievementsTab() {
  const [items, setItems] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<AchForm>(emptyAch)
  const [saving, setSaving] = useState(false)
  const [visibilityTarget, setVisibilityTarget] = useState<Achievement | null>(null)
  const [toggling, setToggling] = useState(false)
  const [snack, setSnack] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null)

  const load = () =>
    apiClient.get<Achievement[]>('/api/achievements/all')
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditId(null); setForm(emptyAch); setDialogOpen(true) }
  const openEdit = (a: Achievement) => {
    setEditId(a.id)
    setForm({ label: a.label, detail: a.detail, icon: a.icon, display_order: a.display_order, is_visible: a.is_visible })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editId) {
        await apiClient.patch(`/api/achievements/${editId}`, form)
      } else {
        await apiClient.post('/api/achievements', form)
      }
      setDialogOpen(false)
      setSnack({ msg: 'Saved!', severity: 'success' })
      invalidateCache('achievements')
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
      await apiClient.patch(`/api/achievements/${visibilityTarget.id}`, { is_visible: !visibilityTarget.is_visible })
      setItems((prev) => prev.map((x) =>
        x.id === visibilityTarget.id ? { ...x, is_visible: !visibilityTarget.is_visible } : x
      ))
      invalidateCache('achievements')
      setVisibilityTarget(null)
    } finally {
      setToggling(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this achievement?')) return
    try {
      await apiClient.delete(`/api/achievements/${id}`)
      invalidateCache('achievements')
      setItems((prev) => prev.filter((a) => a.id !== id))
      setSnack({ msg: 'Deleted.', severity: 'success' })
    } catch {
      setSnack({ msg: 'Delete failed.', severity: 'error' })
    }
  }

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress sx={{ color: '#00B4D8' }} /></Box>

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button startIcon={<AddIcon />} variant="contained" onClick={openCreate}
          sx={{ background: 'linear-gradient(135deg, #00B4D8, #7C3AED)', fontWeight: 700, textTransform: 'none' }}>
          Add Achievement
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {items.map((a) => (
          <GlassCard key={a.id} hover={false} sx={{
            p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            opacity: a.is_visible ? 1 : 0.55,
            border: a.is_visible ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(239,68,68,0.2)',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ fontSize: '1.8rem', lineHeight: 1 }}>{a.icon}</Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography fontWeight={800} sx={{ fontSize: 18, color: '#00B4D8' }}>{a.label}</Typography>
                  {!a.is_visible && (
                    <Chip label="Hidden" size="small"
                      sx={{ height: 18, fontSize: 10, bgcolor: 'rgba(239,68,68,0.15)', color: '#F87171' }} />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary">{a.detail}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
              <Tooltip title={a.is_visible ? 'Hide' : 'Show'}>
                <IconButton size="small" onClick={() => setVisibilityTarget(a)}
                  sx={{ color: a.is_visible ? '#10B981' : '#64748B' }}>
                  {a.is_visible ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton size="small" onClick={() => openEdit(a)} sx={{ color: '#94A3B8' }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton size="small" onClick={() => handleDelete(a.id)} sx={{ color: '#EF4444' }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </GlassCard>
        ))}
      </Box>

      {items.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
          No achievements yet.
        </Typography>
      )}

      {/* Visibility confirm */}
      <Dialog open={!!visibilityTarget} onClose={() => !toggling && setVisibilityTarget(null)}
        PaperProps={{ sx: { bgcolor: '#0E1426', border: '1px solid rgba(0,180,216,0.15)', borderRadius: 3, minWidth: 360 } }}>
        <DialogTitle sx={{ color: '#E2E8F0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {visibilityTarget?.is_visible
            ? <RemoveCircleOutlineIcon sx={{ color: '#F59E0B' }} />
            : <AddCircleOutlineIcon sx={{ color: '#10B981' }} />}
          {visibilityTarget?.is_visible ? 'Remove from Achievements?' : 'Show in Achievements?'}
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {visibilityTarget?.is_visible
              ? <><strong style={{ color: '#E2E8F0' }}>{visibilityTarget?.label}</strong> will be hidden from visitors.</>
              : <><strong style={{ color: '#E2E8F0' }}>{visibilityTarget?.label}</strong> will be visible to visitors.</>
            }
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setVisibilityTarget(null)} disabled={toggling} sx={{ color: '#64748B', textTransform: 'none' }}>Cancel</Button>
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
        <DialogTitle sx={{ color: '#E2E8F0', fontWeight: 700 }}>{editId ? 'Edit Achievement' : 'New Achievement'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Icon (emoji)" value={form.icon}
              onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              size="small" sx={{ width: 120 }} inputProps={{ style: { fontSize: 22 } }} />
            <TextField label="Label" value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              fullWidth size="small" helperText='e.g. "350+", "Top 9.5%"' />
          </Box>
          <TextField label="Detail" value={form.detail}
            onChange={(e) => setForm((f) => ({ ...f, detail: e.target.value }))}
            fullWidth size="small" helperText='e.g. "Problems solved on GeeksforGeeks"' />
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

// ─── Certifications ────────────────────────────────────────────────────────────

interface CertForm { title: string; issuer: string; url: string; display_order: number; is_visible: boolean }
const emptyCert: CertForm = { title: '', issuer: '', url: '', display_order: 0, is_visible: true }

function CertificationsTab() {
  const [items, setItems] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<CertForm>(emptyCert)
  const [saving, setSaving] = useState(false)
  const [visibilityTarget, setVisibilityTarget] = useState<Certification | null>(null)
  const [toggling, setToggling] = useState(false)
  const [snack, setSnack] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null)

  const load = () =>
    apiClient.get<Certification[]>('/api/achievements/certifications/all')
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditId(null); setForm(emptyCert); setDialogOpen(true) }
  const openEdit = (c: Certification) => {
    setEditId(c.id)
    setForm({ title: c.title, issuer: c.issuer, url: c.url, display_order: c.display_order, is_visible: c.is_visible })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editId) {
        await apiClient.patch(`/api/achievements/certifications/${editId}`, form)
      } else {
        await apiClient.post('/api/achievements/certifications', form)
      }
      setDialogOpen(false)
      setSnack({ msg: 'Saved!', severity: 'success' })
      invalidateCache('certifications')
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
      await apiClient.patch(`/api/achievements/certifications/${visibilityTarget.id}`, { is_visible: !visibilityTarget.is_visible })
      setItems((prev) => prev.map((x) =>
        x.id === visibilityTarget.id ? { ...x, is_visible: !visibilityTarget.is_visible } : x
      ))
      invalidateCache('certifications')
      setVisibilityTarget(null)
    } finally {
      setToggling(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this certification?')) return
    try {
      await apiClient.delete(`/api/achievements/certifications/${id}`)
      invalidateCache('certifications')
      setItems((prev) => prev.filter((c) => c.id !== id))
      setSnack({ msg: 'Deleted.', severity: 'success' })
    } catch {
      setSnack({ msg: 'Delete failed.', severity: 'error' })
    }
  }

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress sx={{ color: '#00B4D8' }} /></Box>

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button startIcon={<AddIcon />} variant="contained" onClick={openCreate}
          sx={{ background: 'linear-gradient(135deg, #00B4D8, #7C3AED)', fontWeight: 700, textTransform: 'none' }}>
          Add Certification
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {items.map((c) => (
          <GlassCard key={c.id} hover={false} sx={{
            p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            opacity: c.is_visible ? 1 : 0.55,
            border: c.is_visible ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(239,68,68,0.2)',
          }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography fontWeight={700} sx={{ color: '#E2E8F0' }}>{c.title}</Typography>
                {!c.is_visible && (
                  <Chip label="Hidden" size="small"
                    sx={{ height: 18, fontSize: 10, bgcolor: 'rgba(239,68,68,0.15)', color: '#F87171' }} />
                )}
              </Box>
              <Typography variant="body2" sx={{ color: '#00B4D8', fontWeight: 500 }}>{c.issuer}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-all' }}>{c.url}</Typography>
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
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
          No certifications yet.
        </Typography>
      )}

      {/* Visibility confirm */}
      <Dialog open={!!visibilityTarget} onClose={() => !toggling && setVisibilityTarget(null)}
        PaperProps={{ sx: { bgcolor: '#0E1426', border: '1px solid rgba(0,180,216,0.15)', borderRadius: 3, minWidth: 360 } }}>
        <DialogTitle sx={{ color: '#E2E8F0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {visibilityTarget?.is_visible
            ? <RemoveCircleOutlineIcon sx={{ color: '#F59E0B' }} />
            : <AddCircleOutlineIcon sx={{ color: '#10B981' }} />}
          {visibilityTarget?.is_visible ? 'Remove from Certifications?' : 'Show in Certifications?'}
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {visibilityTarget?.is_visible
              ? <><strong style={{ color: '#E2E8F0' }}>{visibilityTarget?.title}</strong> will be hidden from visitors.</>
              : <><strong style={{ color: '#E2E8F0' }}>{visibilityTarget?.title}</strong> will be visible to visitors.</>
            }
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setVisibilityTarget(null)} disabled={toggling} sx={{ color: '#64748B', textTransform: 'none' }}>Cancel</Button>
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
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { bgcolor: '#0E1426', border: '1px solid rgba(0,180,216,0.2)', borderRadius: 3 } }}>
        <DialogTitle sx={{ color: '#E2E8F0', fontWeight: 700 }}>{editId ? 'Edit Certification' : 'New Certification'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          <TextField label="Title" value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            fullWidth size="small" helperText='e.g. "HackerRank Problem Solving"' />
          <TextField label="Issuer" value={form.issuer}
            onChange={(e) => setForm((f) => ({ ...f, issuer: e.target.value }))}
            fullWidth size="small" helperText='e.g. "HackerRank"' />
          <TextField label="Certificate URL" value={form.url}
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            fullWidth size="small" />
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

// ─── Combined Manager ──────────────────────────────────────────────────────────

export default function AdminAchievementsManager() {
  const [tab, setTab] = useState(0)

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} color="#E2E8F0">Achievements & Certifications</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Manage competitive programming highlights and professional certifications.
        </Typography>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{
        mb: 3,
        '& .MuiTabs-indicator': { background: 'linear-gradient(90deg, #00B4D8, #7C3AED)', height: 3, borderRadius: 2 },
        '& .MuiTab-root': { color: '#64748B', fontWeight: 600, textTransform: 'none', '&.Mui-selected': { color: '#00B4D8' } },
      }}>
        <Tab icon={<EmojiEventsIcon fontSize="small" />} iconPosition="start" label="Achievements" />
        <Tab icon={<WorkspacePremiumIcon fontSize="small" />} iconPosition="start" label="Certifications" />
      </Tabs>

      {tab === 0 && <AchievementsTab />}
      {tab === 1 && <CertificationsTab />}
    </Box>
  )
}
