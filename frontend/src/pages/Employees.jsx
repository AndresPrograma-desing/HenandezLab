import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import axiosClient from '../api/axiosClient';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  
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
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleOpenEdit = (employee) => {
    setEditingEmployee(employee);
    
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
  };

  // Guardar (crear o editar)
  const handleSubmit = (e) => {
    e.preventDefault();
    const request = editingEmployee
      ? axiosClient.put(`/employees/${editingEmployee.id}`, formData)
      : axiosClient.post('/employees', formData);

    request
      .then(() => {
        loadEmployees();
        handleCloseModal();
      })
      .catch((err) => {
        alert(err.response?.data?.message || 'Error al guardar el empleado');
      });
  };

  // Eliminar
  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este empleado?')) {
      axiosClient
        .delete(`/employees/${id}`)
        .then(() => {
          loadEmployees();
        })
        .catch((err) => {
          alert(err.response?.data?.message || 'Error al eliminar el empleado');
        });
    }
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
