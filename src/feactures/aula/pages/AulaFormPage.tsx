import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../shared/components/Dialog';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { RegistrarAula, PartialAula, AulaResponseDTO, TipoAula, EstadoAula } from '../types/interfaceAulas';

interface AulaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RegistrarAula | PartialAula, isEdit?: boolean) => Promise<{ success: boolean; error?: string }>;
  aula?: AulaResponseDTO | null;
}

export const AulaFormModal: React.FC<AulaFormProps> = ({ isOpen, onClose, onSubmit, aula }) => {
  const isEdit = !!aula;
  const [formData, setFormData] = useState<RegistrarAula | PartialAula>({
    nombre: '',
    capacidad: 0,
    equipos: '',
    descripcion: '',
    tipo: TipoAula.AULA_DE_CLASE,
    estado: EstadoAula.DISPONIBLE,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (aula) {
      setFormData({
        nombre: aula.nombre,
        capacidad: aula.capacidad,
        equipos: aula.equipos,
        descripcion: aula.descripcion,
        tipo: aula.tipo,
        estado: aula.estado,
      });
    } else {
      setFormData({
        nombre: '',
        capacidad: 0,
        equipos: '',
        descripcion: '',
        tipo: TipoAula.AULA_DE_CLASE,
        estado: EstadoAula.DISPONIBLE,
      });
    }
  }, [aula, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'capacidad' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await onSubmit(formData, isEdit);
    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Error al guardar el aula');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl w-full bg-white rounded-2xl shadow-lg px-6 py-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary-700 mb-4">
            {isEdit ? 'Editar Aula' : 'Registrar Aula'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <Input name="nombre" value={formData.nombre} onChange={handleChange} required placeholder="Nombre del aula" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad</label>
            <Input name="capacidad" type="number" value={formData.capacidad} onChange={handleChange} required min={1} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Equipos</label>
            <Input name="equipos" value={formData.equipos} onChange={handleChange} required placeholder="Ej: Proyector, Computadora" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <Input name="descripcion" value={formData.descripcion} onChange={handleChange} required placeholder="Descripción del aula" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring focus:ring-primary-500 focus:outline-none"
            >
              <option value={TipoAula.AULA_DE_CLASE}>Aula de Clase</option>
              <option value={TipoAula.AULA_DE_INNOVACION}>Aula de Innovación</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring focus:ring-primary-500 focus:outline-none"
            >
              <option value={EstadoAula.DISPONIBLE}>Disponible</option>
              <option value={EstadoAula.OCUPADO}>Ocupado</option>
            </select>
          </div>
          {error && (
            <div className="sm:col-span-2">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}
          <div className="sm:col-span-2 flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
