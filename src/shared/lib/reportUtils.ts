import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ReportData {
  title: string;
  headers: string[];
  data: any[];
  filters?: Record<string, string>;
}

export const generatePDFReport = ({
  title,
  headers,
  data,
  filters
}: ReportData) => {
  try {
    console.log('Iniciando generación de PDF...');
    console.log('Título:', title);
    console.log('Encabezados:', headers);
    console.log('Datos:', data);
    console.log('Filtros:', filters);

    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 25);
    
    // Add filters if any
    if (filters) {
      let yPos = 35;
      doc.setFontSize(10);
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          doc.text(`${key}: ${value}`, 14, yPos);
          yPos += 7;
        }
      });
    }

    // Add table
    const tableColumn = headers;
    const tableRows = data.map(item => {
      console.log('Procesando fila:', item);
      return headers.map(header => {
        const key = header.toLowerCase().replace(/\s+/g, '_');
        const value = item[key] || '';
        console.log(`Header: ${header}, Key: ${key}, Value:`, value);
        return value;
      });
    });

    console.log('Columnas de la tabla:', tableColumn);
    console.log('Filas de la tabla:', tableRows);

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: filters ? 50 : 35,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold',
      },
    });

    // Save the PDF
    const fileName = `${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    console.log('Guardando PDF como:', fileName);
    doc.save(fileName);
    console.log('PDF generado exitosamente');
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    throw error;
  }
}; 