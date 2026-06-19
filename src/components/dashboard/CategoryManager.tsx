import { useEffect, useState, useCallback } from 'react';
import { AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import {
  fetchCategories,
  updateCategory,
  type Category,
} from '../../services/dashboardService';
import { Modal, Button, Skeleton } from '../ui';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUnauthorized: () => void;
}

const KIND_LABELS: Record<string, string> = {
  expense: 'Gastos',
  income: 'Ingresos',
  appointment: 'Citas',
};

export function CategoryManager({ isOpen, onClose, onUnauthorized }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isOpen) return;
    setLoading(true);
    setError(false);
    setFeedback(null);
    const result = await fetchCategories();
    if (!result.ok) {
      if (result.status === 'unauthorized') onUnauthorized();
      else setError(true);
      setLoading(false);
      return;
    }
    setCategories(result.data.categories);
    const names: Record<string, string> = {};
    result.data.categories.forEach((c) => (names[c.id] = c.display_name));
    setEditName(names);
    setLoading(false);
  }, [isOpen, onUnauthorized]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleToggleActive(category: Category) {
    setSavingId(category.id);
    setFeedback(null);
    const result = await updateCategory(category.id, { is_active: !category.is_active });
    if (!result.ok) {
      if (result.status === 'unauthorized') onUnauthorized();
      else setFeedback('No se pudo actualizar. Intenta de nuevo.');
      setSavingId(null);
      return;
    }
    setCategories((prev) =>
      prev.map((c) => (c.id === category.id ? { ...c, is_active: !c.is_active } : c)),
    );
    setSavingId(null);
  }

  async function handleSaveName(category: Category) {
    const newName = editName[category.id]?.trim();
    if (!newName || newName === category.display_name) return;
    setSavingId(category.id);
    setFeedback(null);
    const result = await updateCategory(category.id, { display_name: newName });
    if (!result.ok) {
      if (result.status === 'unauthorized') {
        onUnauthorized();
        setSavingId(null);
        return;
      }
      setFeedback(result.status === 'error' ? 'Ese nombre ya existe o es inválido.' : 'Error al guardar.');
      setSavingId(null);
      return;
    }
    setCategories((prev) =>
      prev.map((c) => (c.id === category.id ? { ...c, display_name: newName } : c)),
    );
    setSavingId(null);
  }

  function handleKeyDown(e: React.KeyboardEvent, category: Category) {
    if (e.key === 'Enter') handleSaveName(category);
    if (e.key === 'Escape') {
      setEditName((prev) => ({ ...prev, [category.id]: category.display_name }));
    }
  }

  const grouped = categories.reduce<Record<string, Category[]>>((acc, c) => {
    if (!acc[c.kind]) acc[c.kind] = [];
    acc[c.kind].push(c);
    return acc;
  }, {});

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configurar categorías">
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        {feedback && (
          <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {feedback}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center justify-between py-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <p className="text-sm text-dark-muted">No se pudieron cargar las categorías.</p>
            <button
              onClick={load}
              className="mt-2 text-xs font-medium px-4 py-2 rounded-lg bg-orange-500/15 text-orange-300 hover:bg-orange-500/25 transition"
            >
              Reintentar
            </button>
          </div>
        ) : (
          Object.entries(grouped).map(([kind, items]) => (
            <div key={kind}>
              <h3 className="text-xs font-semibold text-dark-muted uppercase tracking-wider mb-2">
                {KIND_LABELS[kind] || kind}
              </h3>
              <div className="space-y-2">
                {items.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center gap-3 bg-dark-elevated border border-dark-border rounded-xl px-3 py-2.5"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editName[cat.id] ?? cat.display_name}
                          onChange={(e) =>
                            setEditName((prev) => ({ ...prev, [cat.id]: e.target.value }))
                          }
                          onKeyDown={(e) => handleKeyDown(e, cat)}
                          onBlur={() => handleSaveName(cat)}
                          disabled={savingId === cat.id}
                          className="bg-transparent text-sm text-dark-text outline-none border-b border-transparent focus:border-dark-accent w-full min-w-0"
                          aria-label={`Nombre de categoría ${cat.display_name}`}
                        />
                        {savingId === cat.id && (
                          <span className="text-[10px] text-dark-muted">Guardando…</span>
                        )}
                      </div>
                      {!cat.slug && (
                        <span className="text-[10px] text-dark-muted-dim">Personalizada</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleToggleActive(cat)}
                      disabled={savingId === cat.id}
                      className="flex-shrink-0 transition-opacity disabled:opacity-50"
                      aria-label={cat.is_active ? 'Desactivar categoría' : 'Activar categoría'}
                      title={cat.is_active ? 'Activa — click para desactivar' : 'Inactiva — click para activar'}
                    >
                      {cat.is_active ? (
                        <ToggleRight className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-dark-muted-dim" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-dark-border-subtle">
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </Modal>
  );
}
