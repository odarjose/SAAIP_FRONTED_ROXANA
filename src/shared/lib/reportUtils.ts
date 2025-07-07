import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ReportData {
  title: string;
  headers: string[];
  data: any[];
  filters?: Record<string, string>;
}

interface AsistenciaReportData {
  estadisticasGenerales: {
    totalAsistencias: number;
    totalRegistrados: number;
    totalInasistencias: number;
    porcentajeAsistencia: number;
    promedioTiempoUso: number;
  };
  estadisticasPorDocente: Array<{
    id_docente: number;
    nombres: string;
    apellidos: string;
    dni: string;
    totalAsistencias: number;
    totalRegistrados: number;
    totalInasistencias: number;
    porcentajeAsistencia: number;
    promedioTiempoUso: number;
  }>;
  estadisticasPorTurno: Array<{
    tipo_turno: string;
    totalAsistencias: number;
    totalRegistrados: number;
    totalInasistencias: number;
    porcentajeAsistencia: number;
  }>;
  filtros: Record<string, string>;
}

// Función para generar datos de gráfica de asistencias

// Función para generar datos de gráfica de turnos


// Función para generar datos de gráfica de docentes

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

export const generateAsistenciaPDFReport = ({
  estadisticasGenerales,
  estadisticasPorDocente,
  estadisticasPorTurno,
  filtros
}: AsistenciaReportData) => {
  try {
    console.log('Iniciando generación de PDF de Asistencias...');
    
    const doc = new jsPDF();
    let yPos = 20;
    
    // Título principal
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Reporte de Asistencias', 14, yPos);
    yPos += 15;
    
    // Fecha de generación
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, 14, yPos);
    yPos += 10;
    
    // Filtros aplicados
    if (filtros && Object.keys(filtros).length > 0) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Filtros Aplicados:', 14, yPos);
      yPos += 7;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      Object.entries(filtros).forEach(([key, value]) => {
        if (value && value !== 'Sin filtro' && value !== 'Todos') {
          doc.text(`• ${key}: ${value}`, 20, yPos);
          yPos += 5;
        }
      });
      yPos += 5;
    }
    
    // Resumen Ejecutivo
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen Ejecutivo', 14, yPos);
    yPos += 7;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const resumenText = [
      `• Total de asistencias registradas: ${estadisticasGenerales.totalAsistencias}`,
      `• Asistencias efectivas: ${estadisticasGenerales.totalRegistrados} (${estadisticasGenerales.porcentajeAsistencia}%)`,
      `• Inasistencias: ${estadisticasGenerales.totalInasistencias}`,
      `• Tiempo promedio de uso: ${estadisticasGenerales.promedioTiempoUso} minutos`,
      `• Docentes evaluados: ${estadisticasPorDocente.length}`
    ];
    
    resumenText.forEach(text => {
      doc.text(text, 20, yPos);
      yPos += 5;
    });
    yPos += 5;
    
    // Estadísticas Generales
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Estadísticas Generales', 14, yPos);
    yPos += 10;
    
    // Tabla de estadísticas generales
    const statsHeaders = ['Métrica', 'Valor'];
    const statsData = [
      ['Total Asistencias', estadisticasGenerales.totalAsistencias.toString()],
      ['Registrados', estadisticasGenerales.totalRegistrados.toString()],
      ['Inasistencias', estadisticasGenerales.totalInasistencias.toString()],
      ['% Asistencia', `${estadisticasGenerales.porcentajeAsistencia}%`],
      ['Tiempo Promedio', `${estadisticasGenerales.promedioTiempoUso} min`]
    ];
    
    (doc as any).autoTable({
      head: [statsHeaders],
      body: statsData,
      startY: yPos,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 11,
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
        1: { halign: 'center' }
      }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 15;
    
    // Verificar si hay espacio para la siguiente tabla
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    // Estadísticas por Docente
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Estadísticas por Docente', 14, yPos);
    yPos += 10;
    
    if (estadisticasPorDocente.length > 0) {
      const docenteHeaders = ['Docente', 'Total', 'Registrados', 'Inasistencias', '% Asistencia', 'Tiempo Prom.'];
      const docenteData = estadisticasPorDocente.map(docente => [
        `${docente.nombres} ${docente.apellidos}`,
        docente.totalAsistencias.toString(),
        docente.totalRegistrados.toString(),
        docente.totalInasistencias.toString(),
        `${docente.porcentajeAsistencia}%`,
        `${docente.promedioTiempoUso} min`
      ]);
      
      (doc as any).autoTable({
        head: [docenteHeaders],
        body: docenteData,
        startY: yPos,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [52, 152, 219],
          textColor: 255,
          fontSize: 9,
          fontStyle: 'bold',
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { halign: 'center', cellWidth: 15 },
          2: { halign: 'center', cellWidth: 20 },
          3: { halign: 'center', cellWidth: 20 },
          4: { halign: 'center', cellWidth: 20 },
          5: { halign: 'center', cellWidth: 20 }
        }
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 15;
    } else {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text('No hay datos de docentes disponibles', 14, yPos);
      yPos += 10;
    }
    
    // Verificar si hay espacio para la siguiente tabla
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    // Estadísticas por Turno
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Estadísticas por Turno', 14, yPos);
    yPos += 10;
    
    if (estadisticasPorTurno.length > 0) {
      const turnoHeaders = ['Tipo de Turno', 'Total', 'Registrados', 'Inasistencias', '% Asistencia'];
      const turnoData = estadisticasPorTurno.map(turno => [
        turno.tipo_turno,
        turno.totalAsistencias.toString(),
        turno.totalRegistrados.toString(),
        turno.totalInasistencias.toString(),
        `${turno.porcentajeAsistencia}%`
      ]);
      
      (doc as any).autoTable({
        head: [turnoHeaders],
        body: turnoData,
        startY: yPos,
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [46, 204, 113],
          textColor: 255,
          fontSize: 10,
          fontStyle: 'bold',
        },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { halign: 'center', cellWidth: 20 },
          2: { halign: 'center', cellWidth: 25 },
          3: { halign: 'center', cellWidth: 25 },
          4: { halign: 'center', cellWidth: 25 }
        }
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 15;
    } else {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text('No hay datos de turnos disponibles', 14, yPos);
      yPos += 10;
    }
    
    // Verificar si hay espacio para gráficas
    if (yPos > 200) {
      doc.addPage();
      yPos = 20;
    }
    
    // Gráficas
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Gráficas y Visualizaciones', 14, yPos);
    yPos += 15;
    
    // Gráfica de Distribución de Asistencias (simplificada)
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Distribución de Asistencias', 14, yPos);
    yPos += 8;
    
    // Crear gráfica de barras simplificada
    const chartWidth = 80;
    const chartHeight = 40;
    const chartX = 20;
    const chartY = yPos;
    
    // Fondo del gráfico
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(240, 240, 240);
    doc.rect(chartX, chartY, chartWidth, chartHeight, 'F');
    
    // Ejes
    doc.setDrawColor(100, 100, 100);
    doc.line(chartX, chartY + chartHeight, chartX + chartWidth, chartY + chartHeight); // Eje X
    doc.line(chartX, chartY, chartX, chartY + chartHeight); // Eje Y
    
    // Barras
    const maxValue = Math.max(estadisticasGenerales.totalRegistrados, estadisticasGenerales.totalInasistencias);
    const barWidth = 25;
    const barSpacing = 10;
    
    // Barra de Registrados
    const registradosHeight = (estadisticasGenerales.totalRegistrados / maxValue) * (chartHeight - 10);
    doc.setFillColor(34, 197, 94);
    doc.rect(chartX + 5, chartY + chartHeight - registradosHeight, barWidth, registradosHeight, 'F');
    
    // Barra de Inasistencias
    const inasistenciasHeight = (estadisticasGenerales.totalInasistencias / maxValue) * (chartHeight - 10);
    doc.setFillColor(239, 68, 68);
    doc.rect(chartX + 5 + barWidth + barSpacing, chartY + chartHeight - inasistenciasHeight, barWidth, inasistenciasHeight, 'F');
    
    // Etiquetas
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Registrados', chartX + 5, chartY + chartHeight + 5);
    doc.text('Inasistencias', chartX + 5 + barWidth + barSpacing, chartY + chartHeight + 5);
    
    // Valores
    doc.setFontSize(7);
    doc.text(estadisticasGenerales.totalRegistrados.toString(), chartX + 5 + barWidth/2, chartY + chartHeight - registradosHeight - 3, { align: 'center' });
    doc.text(estadisticasGenerales.totalInasistencias.toString(), chartX + 5 + barWidth + barSpacing + barWidth/2, chartY + chartHeight - inasistenciasHeight - 3, { align: 'center' });
    
    yPos += chartHeight + 20;
    
    // Verificar si hay espacio para la siguiente gráfica
    if (yPos > 200) {
      doc.addPage();
      yPos = 20;
    }
    
    // Gráfica de Turnos (si hay datos)
    if (estadisticasPorTurno.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('2. Asistencias por Tipo de Turno', 14, yPos);
      yPos += 8;
      
      // Crear gráfica de turnos
      const turnoChartWidth = 80;
      const turnoChartHeight = 40;
      const turnoChartX = 20;
      const turnoChartY = yPos;
      
      // Fondo del gráfico
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(240, 240, 240);
      doc.rect(turnoChartX, turnoChartY, turnoChartWidth, turnoChartHeight, 'F');
      
      // Ejes
      doc.setDrawColor(100, 100, 100);
      doc.line(turnoChartX, turnoChartY + turnoChartHeight, turnoChartX + turnoChartWidth, turnoChartY + turnoChartHeight);
      doc.line(turnoChartX, turnoChartY, turnoChartX, turnoChartY + turnoChartHeight);
      
      // Calcular máximo para escalar
      const maxTurnoValue = Math.max(...estadisticasPorTurno.map(t => t.totalAsistencias));
      const turnoBarWidth = turnoChartWidth / (estadisticasPorTurno.length * 2);
      
      estadisticasPorTurno.forEach((turno, index) => {
        const x = turnoChartX + 5 + (index * turnoBarWidth * 2);
        const registradosHeight = (turno.totalRegistrados / maxTurnoValue) * (turnoChartHeight - 10);
        const inasistenciasHeight = (turno.totalInasistencias / maxTurnoValue) * (turnoChartHeight - 10);
        
        // Barra de registrados
        doc.setFillColor(34, 197, 94);
        doc.rect(x, turnoChartY + turnoChartHeight - registradosHeight, turnoBarWidth, registradosHeight, 'F');
        
        // Barra de inasistencias
        doc.setFillColor(239, 68, 68);
        doc.rect(x + turnoBarWidth, turnoChartY + turnoChartHeight - inasistenciasHeight, turnoBarWidth, inasistenciasHeight, 'F');
        
        // Etiqueta del turno
        doc.setFontSize(6);
        doc.setFont('helvetica', 'normal');
        doc.text(turno.tipo_turno.substring(0, 8), x, turnoChartY + turnoChartHeight + 5);
      });
      
      yPos += turnoChartHeight + 20;
    }
    
    // Verificar si hay espacio para la siguiente gráfica
    if (yPos > 200) {
      doc.addPage();
      yPos = 20;
    }
    
    // Gráfica de Top Docentes (si hay datos)
    if (estadisticasPorDocente.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('3. Top 5 Docentes por Asistencias', 14, yPos);
      yPos += 8;
      
      const topDocentes = estadisticasPorDocente
        .sort((a, b) => b.totalAsistencias - a.totalAsistencias)
        .slice(0, 5);
      
      const docenteChartWidth = 80;
      const docenteChartHeight = 40;
      const docenteChartX = 20;
      const docenteChartY = yPos;
      
      // Fondo del gráfico
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(240, 240, 240);
      doc.rect(docenteChartX, docenteChartY, docenteChartWidth, docenteChartHeight, 'F');
      
      // Ejes
      doc.setDrawColor(100, 100, 100);
      doc.line(docenteChartX, docenteChartY + docenteChartHeight, docenteChartX + docenteChartWidth, docenteChartY + docenteChartHeight);
      doc.line(docenteChartX, docenteChartY, docenteChartX, docenteChartY + docenteChartHeight);
      
      // Calcular máximo para escalar
      const maxDocenteValue = Math.max(...topDocentes.map(d => d.totalAsistencias));
      const docenteBarWidth = docenteChartWidth / topDocentes.length;
      
      topDocentes.forEach((docente, index) => {
        const x = docenteChartX + 5 + (index * docenteBarWidth);
        const barHeight = (docente.totalAsistencias / maxDocenteValue) * (docenteChartHeight - 10);
        
        // Barra del docente
        doc.setFillColor(59, 130, 246);
        doc.rect(x, docenteChartY + docenteChartHeight - barHeight, docenteBarWidth - 2, barHeight, 'F');
        
        // Valor
        doc.setFontSize(6);
        doc.setFont('helvetica', 'normal');
        doc.text(docente.totalAsistencias.toString(), x + (docenteBarWidth - 2)/2, docenteChartY + docenteChartHeight - barHeight - 3, { align: 'center' });
        
        // Iniciales del docente
        const iniciales = `${docente.nombres.charAt(0)}${docente.apellidos.charAt(0)}`;
        doc.text(iniciales, x + (docenteBarWidth - 2)/2, docenteChartY + docenteChartHeight + 5, { align: 'center' });
      });
      
      yPos += docenteChartHeight + 20;
    }
    
    // Pie de página
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text(`Página ${i} de ${pageCount}`, 14, doc.internal.pageSize.height - 10);
      doc.text(`Sistema de Asistencia e Información Pedagógica`, doc.internal.pageSize.width - 14, doc.internal.pageSize.height - 10, { align: 'right' });
    }
    
    // Guardar el PDF
    const fileName = `reporte_asistencias_${new Date().toISOString().split('T')[0]}.pdf`;
    console.log('Guardando PDF como:', fileName);
    doc.save(fileName);
    console.log('PDF de asistencias generado exitosamente');
    
  } catch (error) {
    console.error('Error al generar el PDF de asistencias:', error);
    throw error;
  }
}; 