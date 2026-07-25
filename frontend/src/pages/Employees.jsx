import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import axiosClient from '../api/axiosClient';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // States for custom deletion confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  
  const initialFormData = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    hire_date: '',
    status: 'activo'
  };
  
  const [formData, setFormData] = useState(initialFormData);

  // Cargar empleados
  const loadEmployees = () => {
    axiosClient
      .get('/employees')
      .then(({ data }) => setEmployees(data))
      .catch(() => setEmployees([]));
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // Abrir modal para crear
  const handleOpenCreate = () => {
    setEditingEmployee(null);
    setFormData(initialFormData);
    setFormError('');
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleOpenEdit = (employee) => {
    setEditingEmployee(employee);
    setFormError('');
    
    // Formatear fecha para el input type="date" (YYYY-MM-DD)
    let formattedDate = '';
    if (employee.hire_date) {
      formattedDate = new Date(employee.hire_date).toISOString().split('T')[0];
    }

    setFormData({
      first_name: employee.first_name || '',
      last_name: employee.last_name || '',
      email: employee.email || '',
      phone: employee.phone || '',
      position: employee.position || '',
      department: employee.department || '',
      hire_date: formattedDate,
      status: employee.status || 'activo'
    });
    setIsModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
    setFormData(initialFormData);
    setFormError('');
  };

  // Guardar (crear o editar)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar campos obligatorios
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setFormError('El nombre y el apellido son obligatorios');
      return;
    }

    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('El correo electrónico no es válido');
      return;
    }

    // Validar teléfono (no debe contener letras)
    if (formData.phone && /[a-zA-Z]/.test(formData.phone)) {
      setFormError('El número de teléfono no puede contener letras');
      return;
    }

    setSaving(true);
    setFormError('');
    const request = editingEmployee
      ? axiosClient.put(`/employees/${editingEmployee.id}`, formData)
      : axiosClient.post('/employees', formData);

    request
      .then(() => {
        loadEmployees();
        handleCloseModal();
      })
      .catch((err) => {
        setFormError(err.response?.data?.message || 'Error al guardar el empleado');
      })
      .finally(() => {
        setSaving(false);
      });
  };

  // Solicitar eliminación (abre modal)
  const handleDeleteRequest = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteError('');
    setIsDeleteModalOpen(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = () => {
    if (!employeeToDelete) return;
    setIsDeleting(true);
    setDeleteError('');
    axiosClient
      .delete(`/employees/${employeeToDelete.id}`)
      .then(() => {
        loadEmployees();
        setIsDeleteModalOpen(false);
        setEmployeeToDelete(null);
      })
      .catch((err) => {
        setDeleteError(err.response?.data?.message || 'Error al eliminar el empleado');
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  const columns = [
    { key: 'name', header: 'Nombre', render: (row) => `${row.first_name} ${row.last_name}` },
    { key: 'email', header: 'Correo' },
    { key: 'position', header: 'Cargo' },
    { key: 'department', header: 'Departamento' },
    { 
      key: 'status', 
      header: 'Estado',
      render: (row) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
          row.status === 'activo' ? 'bg-green-100 text-green-800' :
          row.status === 'vacaciones' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
        }`}>
          {row.status}
        </span>
      )
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
            onClick={() => handleDeleteRequest(row)}
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
          <h2 className="text-lg font-semibold text-slate-900">Empleados</h2>
          <p className="text-sm text-slate-500">Gestión de personal del laboratorio</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          Agregar Empleado
        </button>
      </div>

      <DataTable columns={columns} data={employees} emptyMessage="No hay empleados registrados" />

      {/* Save / Edit Modal */}
      <Modal
        open={isModalOpen}
        title={editingEmployee ? 'Editar Empleado' : 'Agregar Empleado'}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Nombre *</label>
              <input
                type="text"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Apellido *</label>
              <input
                type="text"
                required
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Correo Electrónico *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Teléfono</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Fecha Contratación</label>
              <input
                type="date"
                value={formData.hire_date}
                onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Cargo</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Departamento</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Estado</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white"
            >
              <option value="activo">Activo</option>
              <option value="vacaciones">En Vacaciones</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          {/* Form Error Banner */}
          {formError && (
            <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600 animate-in fade-in slide-in-from-top-1">
              {formError}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              disabled={saving}
              onClick={handleCloseModal}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Custom Confirmation Modal */}
      <ConfirmModal
        open={isDeleteModalOpen}
        title="¿Eliminar Empleado?"
        message={`Esta acción eliminará de forma permanente al empleado ${employeeToDelete?.first_name} ${employeeToDelete?.last_name}. ¿Deseas continuar?`}
        confirmText="Eliminar Empleado"
        cancelText="Cancelar"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        variant="danger"
      />

      {/* Delete Error Modal/Toast */}
      {deleteError && (
        <ConfirmModal
          open={!!deleteError}
          title="Error al Eliminar"
          message={deleteError}
          confirmText="Entendido"
          cancelText=""
          onConfirm={() => setDeleteError('')}
          onClose={() => setDeleteError('')}
          variant="warning"
        />
      )}
    </div>
  );
}
