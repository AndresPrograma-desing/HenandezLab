import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import axiosClient from '../api/axiosClient';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all', 'insumo', 'reactivo'

  const initialFormData = {
    name: '',
    category: 'insumo',
    quantity: 0,
    unit: 'unidad',
    min_stock: 5,
    expiration_date: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  // Cargar inventario
  const loadInventory = () => {
    axiosClient
      .get('/inventory')
      .then(({ data }) => setItems(data))
      .catch(() => setItems([]));
  };

  useEffect(() => {
    loadInventory();
  }, []);

  // Abrir modal para crear
  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    
    let formattedDate = '';
    if (item.expiration_date) {
      formattedDate = new Date(item.expiration_date).toISOString().split('T')[0];
    }

    setFormData({
      name: item.name || '',
      category: item.category || 'insumo',
      quantity: item.quantity || 0,
      unit: item.unit || 'unidad',
      min_stock: item.min_stock || 0,
      expiration_date: formattedDate
    });
    setIsModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData(initialFormData);
  };

  // Guardar (crear o editar)
  const handleSubmit = (e) => {
    e.preventDefault();
    const request = editingItem
      ? axiosClient.put(`/inventory/${editingItem.id}`, formData)
      : axiosClient.post('/inventory', formData);

    request
      .then(() => {
        loadInventory();
        handleCloseModal();
      })
      .catch((err) => {
        alert(err.response?.data?.message || 'Error al guardar el ítem');
      });
  };

  // Eliminar
  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este ítem del inventario?')) {
      axiosClient
        .delete(`/inventory/${id}`)
        .then(() => {
          loadInventory();
        })
        .catch((err) => {
          alert(err.response?.data?.message || 'Error al eliminar el ítem');
        });
    }
  };

  // Filtrar ítems por la categoría seleccionada
  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const columns = [
    { key: 'name', header: 'Nombre' },
    { 
      key: 'category', 
      header: 'Categoría',
      render: (row) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
          row.category === 'reactivo' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {row.category}
        </span>
      )
    },
    { 
      key: 'quantity', 
      header: 'Stock Actual',
      render: (row) => `${row.quantity} ${row.unit || 'unidades'}`
    },
    { 
      key: 'min_stock', 
      header: 'Stock Mínimo',
      render: (row) => `${row.min_stock} ${row.unit || 'unidades'}`
    },
    {
      key: 'status',
      header: 'Alerta Stock',
      render: (row) => {
        const isLowStock = row.quantity <= row.min_stock;
        return isLowStock ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
            <AlertTriangle className="h-3 w-3 text-red-800" />
            Bajo Stock
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            Normal
          </span>
        );
      }
    },
    {
      key: 'expiration_date',
      header: 'Vencimiento',
      render: (row) => row.expiration_date ? new Date(row.expiration_date).toLocaleDateString() : 'N/A'
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenEdit(row)}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition"
            title="Editar"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-600 transition"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Inventario</h2>
          <p className="text-sm text-slate-500">Insumos y reactivos disponibles</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          Agregar Ítem
        </button>
      </div>

      {/* Tabs de Filtro */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`pb-3 text-sm font-medium border-b-2 -mb-px transition ${
            selectedCategory === 'all'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Todos ({items.length})
        </button>
        <button
          onClick={() => setSelectedCategory('insumo')}
          className={`pb-3 text-sm font-medium border-b-2 -mb-px transition ${
            selectedCategory === 'insumo'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Insumos ({items.filter(i => i.category === 'insumo').length})
        </button>
        <button
          onClick={() => setSelectedCategory('reactivo')}
          className={`pb-3 text-sm font-medium border-b-2 -mb-px transition ${
            selectedCategory === 'reactivo'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Reactivos ({items.filter(i => i.category === 'reactivo').length})
        </button>
      </div>

      <DataTable columns={columns} data={filteredItems} emptyMessage="No hay ítems registrados en esta categoría" />

      <Modal
        open={isModalOpen}
        title={editingItem ? 'Editar Ítem del Inventario' : 'Agregar Ítem al Inventario'}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Nombre del Ítem *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Ej: Inyectadora 5ml, Reactivo Glucosa, etc."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Categoría *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white"
              >
                <option value="insumo">Insumo</option>
                <option value="reactivo">Reactivo</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Unidad de Medida</label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="unidad, caja, frasco, etc."
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Cantidad Inicial *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Stock Mínimo (Alerta) *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.min_stock}
                onChange={(e) => setFormData({ ...formData, min_stock: parseInt(e.target.value) || 0 })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Fecha de Vencimiento (Opcional)</label>
            <input
              type="date"
              value={formData.expiration_date}
              onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCloseModal}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
