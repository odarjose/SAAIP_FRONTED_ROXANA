import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../shared/components/Dialog';
import { RegistrarDocente, TipoContrato, TipoDocencia } from '../interface/InterfaceDocente';
import { useState } from "react";

interface DocentesModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RegistrarDocente) => Promise<{ success: boolean; error?: string }>;
}

export const DocentesModalForm: React.FC<DocentesModalFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<RegistrarDocente>({
    nombres: '',
    apellidos: '',
    direccion: '',
    fecha_nacimiento: '',
    contraseña: '',
    e_mail: '',
    telefono: '',
    dni: '',
    tipo_docencia: 'UNIDOCENCIA' as TipoDocencia,
    fecha_inicio_contrato: '',
    fecha_fin_contrato: '',
    tipo_contrato: 'NOMBRAMIENTO' as TipoContrato,
    estado: true,
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "estado") {
      setFormData((prev) => ({ ...prev, estado: value === "activo" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await onSubmit(formData);
    if (result.success) {
      // ✅ Solo limpiar el formulario, NO cerrar el modal
      setFormData({
        nombres: '',
        apellidos: '',
        direccion: '',
        fecha_nacimiento: '',
        contraseña: '',
        e_mail: '',
        telefono: '',
        dni: '',
        tipo_docencia: 'UNIDOCENCIA' as TipoDocencia,
        fecha_inicio_contrato: '',
        fecha_fin_contrato: '',
        tipo_contrato: 'NOMBRAMIENTO' as TipoContrato,
        estado: true,
      });
      // El modal se cerrará desde el componente padre
    } else {
      setError(result.error || 'Error al crear el profesor');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl w-full bg-white rounded-2xl shadow-lg px-6 py-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary-700 mb-4">Registrar Docente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
            <Input name="nombres" value={formData.nombres} onChange={handleChange} required placeholder="Nombres" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
            <Input name="apellidos" value={formData.apellidos} onChange={handleChange} required placeholder="Apellidos" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input name="e_mail" type="email" value={formData.e_mail} onChange={handleChange} required placeholder="Correo electrónico" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <Input name="contraseña" type="password" value={formData.contraseña} onChange={handleChange} required placeholder="Contraseña" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <Input name="telefono" value={formData.telefono} onChange={handleChange} required placeholder="Teléfono" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
            <Input name="dni" value={formData.dni} onChange={handleChange} required placeholder="DNI" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <Input name="direccion" value={formData.direccion} onChange={handleChange} required placeholder="Dirección" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
            <Input name="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Docencia</label>
            <select
              name="tipo_docencia"
              value={formData.tipo_docencia}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring focus:ring-primary-500 focus:outline-none"
            >
              <option value="UNIDOCENCIA">Unidocencia</option>
              <option value="POLIDOCENCIA">Polidocencia</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Contrato</label>
            <select
              name="tipo_contrato"
              value={formData.tipo_contrato}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring focus:ring-primary-500 focus:outline-none"
            >
              <option value="NOMBRAMIENTO">Nombramiento</option>
              <option value="TEMPORAL">Temporal</option>
              <option value="PROYECTO">Proyecto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
            <Input name="fecha_inicio_contrato" type="date" value={formData.fecha_inicio_contrato} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
            <Input name="fecha_fin_contrato" type="date" value={formData.fecha_fin_contrato} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              name="estado"
              value={formData.estado ? "activo" : "inactivo"}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring focus:ring-primary-500 focus:outline-none"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
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
