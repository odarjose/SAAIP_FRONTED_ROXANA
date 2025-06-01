import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../shared/components/Dialog';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';

interface TurnoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any, isEdit?: boolean) => Promise<{ success: boolean; error?: string }>;
  turno?: any;
}

export const TurnoFormModal: React.FC<TurnoFormProps> = ({ isOpen, onClose, onSubmit, turno }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    hora_inicio: '',
    hora_fin: '',
    grado: '',
    seccion: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (turno) {
      setFormData({
        nombre: turno.nombre || '',
        hora_inicio: turno.hora_inicio || '',
        hora_fin: turno.hora_fin || '',
        grado: turno.grado?.toString() || '',
        seccion: turno.seccion || '',
      });
    } else {
      setFormData({ nombre: '', hora_inicio: '', hora_fin: '', grado: '', seccion: '' });
    }
  }, [turno]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.nombre || !formData.hora_inicio || !formData.hora_fin || !formData.grado || !formData.seccion) {
      setError('Todos los campos son obligatorios');
      return;
    }
    const result = await onSubmit({
      ...formData,
      grado: parseInt(formData.grado, 10),
    }, !!turno);
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <Input name="nombre" value={formData.nombre} onChange={handleChange} required placeholder="Nombre del turno" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hora Inicio</label>
            <Input name="hora_inicio" type="time" value={formData.hora_inicio} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hora Fin</label>
            <Input name="hora_fin" type="time" value={formData.hora_fin} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grado</label>
            <Input name="grado" type="number" value={formData.grado} onChange={handleChange} required placeholder="Grado" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sección</label>
            <Input name="seccion" value={formData.seccion} onChange={handleChange} required placeholder="Sección" />
          </div>
          {error && <div className="col-span-1"><p className="text-red-600 text-sm font-medium">{error}</p></div>}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">{turno ? 'Actualizar' : 'Registrar'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
