import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const DepartmentManager = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ deptName: '', email: '' });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/departments`);
      setDepartments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError('Failed to fetch departments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (department = null) => {
    if (department) {
      setEditingId(department.departmentId || department.id);
      setFormData({
        deptName: department.deptName || '',
        email: department.email || '',
      });
    } else {
      setEditingId(null);
      setFormData({ deptName: '', email: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ deptName: '', email: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.deptName.trim()) {
      setError('Department name is required');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/departments/${editingId}`, formData);
        setSuccess('Department updated successfully');
      } else {
        await axios.post(`${API_BASE_URL}/departments`, formData);
        setSuccess('Department created successfully');
      }
      handleCloseModal();
      fetchDepartments();
    } catch (err) {
      setError(err.message || 'Failed to save department');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      await axios.delete(`${API_BASE_URL}/departments/${id}`);
      setSuccess('Department deleted successfully');
      fetchDepartments();
    } catch (err) {
      setError('Failed to delete department');
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Departments</h2>
          <p className="text-gray-600 text-sm mt-1">Manage departments</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Add Department
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {/* Departments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Loading departments...</p>
          </div>
        ) : departments.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">
              {departments.length === 0
                ? 'No departments yet. Create your first one!'
                : 'No departments found.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {departments.map((dept) => (
                  <tr key={dept.departmentId || dept.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">
                        {dept.deptName || 'Untitled'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 text-sm">
                        {dept.email || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-500 text-sm">
                        {dept.createdAt ? new Date(dept.createdAt).toLocaleDateString() : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(dept)}
                          className="p-2 text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(dept.departmentId || dept.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <DepartmentModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          isEditing={!!editingId}
          isLoading={loading}
        />
      )}
    </div>
  );
};

const DepartmentModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEditing,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">
            {isEditing ? 'Edit Department' : 'Add New Department'}
          </h3>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Department Name *
            </label>
            <input
              type="text"
              value={formData.deptName}
              onChange={(e) =>
                setFormData({ ...formData, deptName: e.target.value })
              }
              placeholder="e.g., IT Support, HR, Sales"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="department@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentManager;
