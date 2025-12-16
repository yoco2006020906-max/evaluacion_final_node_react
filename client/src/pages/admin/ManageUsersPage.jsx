import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, UserCheck, UserX, Mail, Phone, Users, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import usersService from '../../services/users.service';
import { formatDate } from '../../utils/formatters';
import { Bounce, toast, Zoom } from 'react-toastify';
import axios from 'axios';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    role: ''
  });
  
  const [formErrors, setFormErrors] = useState({});

  const formatId = (idUser) => {
    const longitud = idUser.length;
    const id = idUser.slice(longitud - 4, longitud);
    return id;
  };

  // Cargar usuarios y roles
  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  const fetchRoles = async () => {
    try {
      const { data } = await axios.get('/roles');
      const roles = data.data;
      setRoles(roles);
    } catch (error) {
      toast.error('Error cargando roles', {
        position: "bottom-right",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    const result = await usersService.getAllUsers();
    if (result.success) {
      setUsers(result.data);
    } else {
      toast.error('Error mostrando usuarios!', {
        position: "bottom-right",
        autoClose: 2000,
        theme: "colored",
      });
    }
    setLoading(false);
  };

  // Función helper para obtener el nombre del rol desde el ID
  const getRoleName = (roleId) => {
    if (!roleId) return 'Sin rol';
    const role = roles.find(r => r._id === roleId);
    return role ? role.name : 'Sin rol';
  };

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const roleName = getRoleName(user.role);
    const matchesRole = filterRole === '' || roleName === filterRole;
    const matchesStatus = filterStatus === '' || user.estado === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Validar formulario
  const validateForm = () => {
    const errors = {};

    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email inválido';
    }

    if (formData.telefono && !/^\d{10}$/.test(formData.telefono)) {
      errors.telefono = 'Teléfono inválido (10 dígitos)';
    }

    if (!formData.role) {
      errors.role = 'Debes seleccionar un rol';
    }

    if (modalMode === 'create') {
      if (!formData.password) {
        errors.password = 'La contraseña es requerida';
      } else if (formData.password.length < 8) {
        errors.password = 'Mínimo 8 caracteres';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejar cambios en inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario escribe
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      password: '',
      role: ''
    });
    setFormErrors({});
  };

  // Abrir modal para crear
  const handleCreate = () => {
    setModalMode('create');
    setSelectedUser(null);
    resetForm();
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleEdit = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({
      nombre: user.nombre || '',
      email: user.email || '',
      telefono: user.telefono || '',
      password: '',
      role: user.role || '' // El role viene como ID string
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Confirmar eliminación
  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // Eliminar usuario
  const confirmDelete = async () => {
    const result = await usersService.deleteUser(selectedUser._id);
    if (result.success) {
      toast.success('Usuario Eliminado!', {
        position: "bottom-right",
        autoClose: 5000,
        theme: "colored",
        transition: Zoom,
      });
      fetchUsers();
    } else {
      toast.error('No se ha podido eliminar la cuenta!', {
        position: "bottom-right",
        autoClose: 5000,
        theme: "colored",
        transition: Zoom,
      });
    }
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  // Cambiar estado del usuario
  const toggleUserStatus = async (user) => {
    const newStatus = user.estado === 'activo' ? 'inactivo' : 'activo';
    const result = await usersService.changeUserStatus(user._id, newStatus);

    if (result.success) {
      toast.success('Estado actualizado!', {
        position: "bottom-right",
        autoClose: 2000,
        theme: "colored",
      });
      fetchUsers();
    } else {
      toast.error('Ha ocurrido un error cambiando el estado!', {
        position: "bottom-right",
        autoClose: 5000,
        theme: "colored",
        transition: Zoom,
      });
    }
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (modalMode === 'create') {
        const result = await usersService.createUser(formData);
        
        if (result.success) {
          toast.success(`Usuario ${formData.nombre} ha sido creado con éxito`, {
            position: "bottom-right",
            autoClose: 5000,
            theme: "colored",
            transition: Bounce,
          });
          setShowModal(false);
          resetForm();
          fetchUsers();
        } else {
          toast.error(`No se pudo crear el usuario`, {
            position: "bottom-right",
            autoClose: 5000,
            theme: "colored",
            transition: Bounce,
          });
        }
      } else {
        // Editar usuario - enviar role como ID
        const { password, ...updateData } = formData;
        const response = await axios.put(`/users/${selectedUser._id}`, updateData);
        
        if (response.data.success) {
          toast.success(`Usuario ${formData.nombre} ha sido actualizado con éxito`, {
            position: "bottom-right",
            autoClose: 5000,
            theme: "colored",
            transition: Bounce,
          });
          setShowModal(false);
          resetForm();
          fetchUsers();
        } else {
          toast.error('No se pudo actualizar el usuario', {
            position: "bottom-right",
            autoClose: 5000,
            theme: "colored",
            transition: Bounce,
          });
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error en la operación', {
        position: "bottom-right",
        autoClose: 5000,
        theme: "colored",
        transition: Bounce,
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 flex">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <div className="container mx-auto px-6 py-6 lg:py-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border border-emerald-200/50">
              <h1 className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-emerald-900 via-gray-900 to-emerald-700 bg-clip-text text-transparent mb-2 drop-shadow-2xl">
                Gestión de Usuarios
              </h1>
              <p className="text-sm text-emerald-700 font-semibold leading-relaxed">
                Administra roles, estados y crea nuevos usuarios del sistema
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleCreate}
              className="px-5 py-3 text-base font-black shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 h-fit bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border-2 border-emerald-400/50"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nuevo Usuario
            </Button>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="group hover:shadow-2xl hover:shadow-emerald-500/25 hover:-translate-y-2 transition-all duration-500 bg-white/80 backdrop-blur-xl border border-emerald-200/50 overflow-hidden">
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-emerald-700 font-bold text-xs mb-2 uppercase tracking-wide">Total Usuarios</p>
                  <p className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-2xl">
                    {users.length.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-2xl group-hover:scale-110 transition-all duration-300 border-2 border-white/30">
                  <Users className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
              </div>
            </Card>

            <Card className="group hover:shadow-2xl hover:shadow-emerald-500/25 hover:-translate-y-2 transition-all duration-500 bg-white/80 backdrop-blur-xl border border-emerald-200/50 overflow-hidden">
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-emerald-600 font-bold text-xs mb-2 uppercase tracking-wide">Activos</p>
                  <p className="text-2xl font-black bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent drop-shadow-2xl">
                    {users.filter(u => u.estado === 'activo').length}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-xl shadow-2xl group-hover:scale-110 transition-all duration-300 border-2 border-white/30">
                  <UserCheck className="w-6 h-6 text-emerald-900 drop-shadow-lg" />
                </div>
              </div>
            </Card>

            <Card className="group hover:shadow-2xl hover:shadow-emerald-500/25 hover:-translate-y-2 transition-all duration-500 bg-white/80 backdrop-blur-xl border border-emerald-200/50 overflow-hidden">
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-rose-600 font-bold text-xs mb-2 uppercase tracking-wide">Inactivos</p>
                  <p className="text-2xl font-black bg-gradient-to-r from-rose-500 to-red-500 bg-clip-text text-transparent drop-shadow-2xl">
                    {users.filter(u => u.estado === 'inactivo').length}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-rose-500 to-red-500 rounded-xl shadow-2xl group-hover:scale-110 transition-all duration-300 border-2 border-white/30">
                  <UserX className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
              </div>
            </Card>

            <Card className="group hover:shadow-2xl hover:shadow-emerald-500/25 hover:-translate-y-2 transition-all duration-500 bg-white/80 backdrop-blur-xl border border-emerald-200/50 overflow-hidden">
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-blue-600 font-bold text-xs mb-2 uppercase tracking-wide">Clientes</p>
                  <p className="text-2xl font-black bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-2xl">
                    {users.filter(u => getRoleName(u.role) === 'cliente').length}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-2xl group-hover:scale-110 transition-all duration-300 border-2 border-white/30">
                  <CheckCircle className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
              </div>
            </Card>
          </div>

          {/* Filtros y búsqueda */}
          <Card className="mb-6 bg-white/80 backdrop-blur-xl border border-emerald-200/50 shadow-2xl">
            <div className="p-4">
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex-1 relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 w-4 h-4 group-hover:scale-110 transition-all" />
                  <input
                    type="text"
                    placeholder="🔍 Buscar por nombre o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-emerald-50/50 border-2 border-emerald-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400/75 text-sm placeholder-emerald-500 font-semibold shadow-inner hover:shadow-md transition-all duration-300"
                  />
                </div>
                <div className="flex gap-2 min-w-[300px]">
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="flex-1 px-3 py-3 bg-emerald-50/50 border-2 border-emerald-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400/75 text-sm font-semibold shadow-inner hover:shadow-md transition-all duration-300"
                  >
                    <option value="">Todos los roles</option>
                    <option value="admin">Admin</option>
                    <option value="cliente">Cliente</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="flex-1 px-3 py-3 bg-emerald-50/50 border-2 border-emerald-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400/75 text-sm font-semibold shadow-inner hover:shadow-md transition-all duration-300"
                  >
                    <option value="">Todos los estados</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabla de usuarios */}
          <Card className="bg-white/80 backdrop-blur-xl border border-emerald-200/50 shadow-2xl overflow-hidden">
            {loading ? (
              <div className="text-center py-12 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-4 border-dashed border-emerald-200/50">
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4 shadow-xl"></div>
                <p className="text-xl font-black text-emerald-900 mb-1">Cargando usuarios...</p>
                <p className="text-sm text-emerald-600 font-semibold">Preparando tu panel de gestión</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-b-2 border-emerald-300/50">
                        <th className="text-left py-3 px-4 font-black text-sm text-emerald-900">Usuario</th>
                        <th className="text-left py-3 px-4 font-black text-sm text-emerald-900">Contacto</th>
                        <th className="text-left py-3 px-4 font-black text-sm text-emerald-900">Rol</th>
                        <th className="text-left py-3 px-4 font-black text-sm text-emerald-900">Estado</th>
                        <th className="text-left py-3 px-4 font-black text-sm text-emerald-900">Fecha Registro</th>
                        <th className="text-center py-3 px-4 font-black text-sm text-emerald-900">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user._id} className="border-b border-emerald-100/50 hover:bg-emerald-50/50 transition-all duration-300 group">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3 group-hover:scale-[1.02] transition-transform">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-2xl border-2 ${user.estado === 'activo' 
                                ? 'bg-gradient-to-br from-emerald-500 to-teal-500 border-emerald-400' 
                                : 'bg-gradient-to-br from-rose-500 to-red-500 border-rose-400'
                              }`}>
                                <span className="text-white font-black text-sm">
                                  {user.nombre?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-black text-emerald-900 group-hover:text-emerald-700">{user.nombre}</p>
                                <p className="text-xs text-emerald-600 font-semibold">ID: {formatId(user._id)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50/50 rounded-xl border border-emerald-200/50 text-xs">
                                <Mail className="w-3 h-3 text-emerald-500" />
                                <span className="font-semibold text-emerald-800">{user.email}</span>
                              </div>
                              {user.telefono && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50/50 rounded-xl border border-blue-200/50 text-xs">
                                  <Phone className="w-3 h-3 text-blue-500" />
                                  <span className="font-semibold text-blue-800">{user.telefono}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl text-xs font-black shadow-lg ${getRoleName(user.role) === 'admin' ? '' : ''}`}>
                              {getRoleName(user.role)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1.5 rounded-xl text-xs font-black shadow-lg ${user.estado === 'activo'
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
                              : 'bg-gradient-to-r from-rose-500 to-red-500 text-white'
                            }`}>
                              {user.estado.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-sm font-bold text-emerald-700">
                              {formatDate(user.createdAt, 'numeric')}
                            </p>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => toggleUserStatus(user)}
                                className={`p-2 rounded-xl transition-all hover:shadow-2xl hover:scale-110 duration-300 shadow-xl border font-black text-xs ${
                                  user.estado === 'activo'
                                    ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white border-rose-400 hover:from-rose-600 hover:to-red-600 hover:shadow-rose-500/50' 
                                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-400 hover:from-emerald-600 hover:to-teal-600 hover:shadow-emerald-500/50'
                                }`}
                                title={user.estado === 'activo' ? 'Desactivar' : 'Activar'}
                              >
                                {user.estado === 'activo' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleEdit(user)}
                                className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 rounded-xl shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300"
                                title="Editar"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(user)}
                                className="p-2 bg-gradient-to-r from-rose-500 to-red-500 text-white hover:from-rose-600 hover:to-red-600 rounded-xl shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredUsers.length === 0 && (
                    <div className="text-center py-12 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-4 border-dashed border-emerald-200/50">
                      <Users className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                      <p className="text-xl font-black text-emerald-900 mb-2">No se encontraron usuarios</p>
                      <p className="text-sm text-emerald-600 font-semibold">Prueba ajustando los filtros de búsqueda</p>
                    </div>
                  )}
                </div>

                {/* Paginación */}
                <div className="flex items-center justify-between pt-4 border-t-2 border-emerald-200/50 bg-emerald-50/50 px-4 py-3 rounded-b-2xl">
                  <p className="text-sm font-black text-emerald-900">
                    Mostrando <span className="text-emerald-600">{filteredUsers.length}</span> de <span className="text-emerald-600">{users.length}</span> usuarios
                  </p>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Modal de crear/editar */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl">
          {/* Nombre */}
          <div className="bg-white/80 backdrop-blur-xl p-4 rounded-xl border border-emerald-200/50 shadow-xl">
            <label className="block text-sm font-black text-emerald-900 mb-2">
              Nombre Completo <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ej: Juan Pérez"
              className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-sm font-bold shadow-inner hover:shadow-md transition-all duration-300 ${
                formErrors.nombre ? 'border-rose-500 bg-rose-50/50' : 'border-emerald-200/50 bg-emerald-50/50'
              }`}
            />
            {formErrors.nombre && (
              <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {formErrors.nombre}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="bg-white/80 backdrop-blur-xl p-4 rounded-xl border border-emerald-200/50 shadow-xl">
            <label className="block text-sm font-black text-emerald-900 mb-2">
              Email <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 w-4 h-4" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="ejemplo@email.com"
                className={`w-full pl-10 pr-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-sm font-bold shadow-inner hover:shadow-md transition-all duration-300 ${
                  formErrors.email ? 'border-rose-500 bg-rose-50/50' : 'border-emerald-200/50 bg-emerald-50/50'
                }`}
              />
            </div>
            {formErrors.email && (
              <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {formErrors.email}
              </p>
            )}
          </div>

          {/* Teléfono */}
          <div className="bg-white/80 backdrop-blur-xl p-4 rounded-xl border border-emerald-200/50 shadow-xl">
            <label className="block text-sm font-black text-emerald-900 mb-2">
              Teléfono
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 w-4 h-4" />
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="3001234567"
                className={`w-full pl-10 pr-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-sm font-bold shadow-inner hover:shadow-md transition-all duration-300 ${
                  formErrors.telefono ? 'border-rose-500 bg-rose-50/50' : 'border-emerald-200/50 bg-emerald-50/50'
                }`}
              />
            </div>
            {formErrors.telefono && (
              <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {formErrors.telefono}
              </p>
            )}
          </div>

          {/* Rol */}
          <div className="bg-white/80 backdrop-blur-xl p-4 rounded-xl border border-emerald-200/50 shadow-xl">
            <label className="block text-sm font-black text-emerald-900 mb-2">
              Rol <span className="text-rose-500">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-sm font-bold shadow-inner hover:shadow-md transition-all duration-300 ${
                formErrors.role ? 'border-rose-500 bg-rose-50/50' : 'border-emerald-200/50 bg-emerald-50/50'
              }`}
            >
              <option value="">Selecciona un rol</option>
              {roles.map((rol) => (
                <option key={rol._id} value={rol._id}>{rol.name}</option>
              ))}
            </select>
            {formErrors.role && (
              <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {formErrors.role}
              </p>
            )}
          </div>

          {/* Contraseña (solo en crear) */}
          {modalMode === 'create' && (
            <div className="bg-white/80 backdrop-blur-xl p-4 rounded-xl border border-emerald-200/50 shadow-xl">
              <label className="block text-sm font-black text-emerald-900 mb-2">
                Contraseña <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-sm font-bold shadow-inner hover:shadow-md transition-all duration-300 ${
                  formErrors.password ? 'border-rose-500 bg-rose-50/50' : 'border-emerald-200/50 bg-emerald-50/50'
                }`}
              />
              {formErrors.password && (
                <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {formErrors.password}
                </p>
              )}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-6 border-t-2 border-emerald-200/50">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              className="h-12 text-base font-black shadow-2xl hover:shadow-emerald-500/50 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border-2 border-emerald-400/50"
            >
              {modalMode === 'create' ? 'Crear Usuario' : 'Actualizar Usuario'}
            </Button>
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => setShowModal(false)}
              className="h-12 text-base font-black border-2 border-emerald-400/50 hover:border-emerald-500 py-3 bg-white/50 backdrop-blur-xl"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Eliminar Usuario"
        size="lg"
      >
        <div className="space-y-4 p-6 bg-gradient-to-br from-rose-50 to-red-50/50 rounded-2xl border-4 border-rose-200/50">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-rose-500 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white/30">
              <Trash2 className="w-10 h-10 text-white drop-shadow-2xl" />
            </div>
            <h3 className="text-2xl font-black text-rose-900 mb-3 drop-shadow-lg">¿Eliminar usuario?</h3>
            <p className="text-base text-rose-700 font-bold max-w-3xl mx-auto leading-relaxed">
              ¿Estás seguro que deseas eliminar al usuario <strong className="text-rose-900 text-lg">{selectedUser?.nombre}</strong>?
              <br />
              <span className="text-sm text-rose-600">Esta acción no se puede deshacer.</span>
            </p>
          </div>
          <div className="flex gap-3 pt-8 border-t-4 border-rose-200/50">
            <Button
              variant="danger"
              fullWidth
              onClick={confirmDelete}
              className="h-12 text-base font-black shadow-2xl hover:shadow-rose-500/50 py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 border-2 border-rose-500/50"
            >
              Sí, Eliminar Permanentemente
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowDeleteModal(false)}
              className="h-12 text-base font-black border-2 border-emerald-400/50 hover:border-emerald-500 py-3 bg-white/50 backdrop-blur-xl"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageUsersPage;