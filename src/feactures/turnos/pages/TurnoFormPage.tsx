import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../shared/components/Dialog';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { useDocenteStore } from '../../docentes/store/StoreDocente';
import { DocenteResponseDTO } from '../../docentes/interface/InterfaceDocente';

interface TurnoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any, isEdit?: boolean) => Promise<{ success: boolean; error?: string }>;
  turno?: any;
}

export const TurnoFormModal: React.FC<TurnoFormProps> = ({ isOpen, onClose, onSubmit, turno }) => {
  const { profesores, fetchProfesores, loading } = useDocenteStore();
  const [formData, setFormData] = useState({
    idDocente: '',
    fecha_asignacion: '',
    estado: 'disponible',
    tipo_turno: '',
    hora_inicio: '',
    hora_fin: '',
    grado: '',
    seccion: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfesores();
  }, [fetchProfesores]);

  useEffect(() => {
    if (turno) {
      setFormData({
        idDocente: turno.idDocente?.toString() || '',
        fecha_asignacion: turno.fecha_asignacion || '',
        estado: turno.estado ? 'ocupado' : 'disponible',
        tipo_turno: turno.tipo_turno || '',
        hora_inicio: turno.hora_inicio || '',
        hora_fin: turno.hora_fin || '',
        grado: turno.grado?.toString() || '',
        seccion: turno.seccion || '',
      });
    } else {
      setFormData({ 
        idDocente: '', 
        fecha_asignacion: '', 
        estado: 'disponible', 
        tipo_turno: '', 
        hora_inicio: '', 
        hora_fin: '', 
        grado: '', 
        seccion: '' 
      });
    }
  }, [turno]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.idDocente || !formData.fecha_asignacion || !formData.tipo_turno || 
        !formData.hora_inicio || !formData.hora_fin || !formData.grado || !formData.seccion) {
      setError('Todos los campos son obligatorios');
      return;
    }

    // Asegurar que los datos coincidan exactamente con lo que espera el backend
    const dataToSend = {
      id_docente: parseInt(formData.idDocente, 10), // Cambiado a snake_case
      fecha_asignacion: formData.fecha_asignacion,
      estado: formData.estado === 'ocupado',
      tipo_turno: formData.tipo_turno,
      hora_inicio: formData.hora_inicio,
      hora_fin: formData.hora_fin,
      grado: parseInt(formData.grado, 10), // Convertir a número
      seccion: formData.seccion,
    };

    console.log('Datos enviados al backend:', dataToSend); // Para debugging

    const result = await onSubmit(dataToSend, !!turno);
    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Error al guardar el turno');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-full bg-white rounded-2xl shadow-lg px-6 py-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary-700 mb-4">
            {turno ? 'Editar Turno' : 'Registrar Turno'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Docente</label>
            <select
              name="idDocente"
              value={formData.idDocente}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={loading}
            >
              <option value="">Seleccione un docente</option>
              {profesores.map((docente: DocenteResponseDTO) => (
                <option key={docente.id_docente} value={docente.id_docente}>
                  {docente.nombres} {docente.apellidos} - {docente.dni}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de asignación</label>
            <Input 
              name="fecha_asignacion" 
              type="date" 
              value={formData.fecha_asignacion} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select 
              name="estado" 
              value={formData.estado} 
              onChange={handleChange} 
              required 
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="disponible">Disponible</option>
              <option value="ocupado">Ocupado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de turno</label>
            <Input 
              name="tipo_turno" 
              value={formData.tipo_turno} 
              onChange={handleChange} 
              required 
              placeholder="Ej: mañana, tarde, noche" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hora Inicio</label>
            <Input 
              name="hora_inicio" 
              type="time" 
              value={formData.hora_inicio} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hora Fin</label>
            <Input 
              name="hora_fin" 
              type="time" 
              value={formData.hora_fin} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grado</label>
            <Input 
              name="grado" 
              type="number"
              value={formData.grado} 
              onChange={handleChange} 
              required 
              placeholder="Ej: 1, 2, 3..." 
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sección</label>
            <Input 
              name="seccion" 
              value={formData.seccion} 
              onChange={handleChange} 
              required 
              placeholder="Ej: A, B, C..." 
            />
          </div>
          {error && (
            <div className="col-span-1">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {turno ? 'Actualizar' : 'Registrar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};