/**
 * Genera un PDF con una tabla y lo descarga en el navegador.
 *
 * columns: [{ header: 'Nombre', key: 'nombre' }]
 * rows: array de objetos cuyas claves coinciden con `key` de cada columna.
 */
export const exportToPdf = async ({ fileName, title, columns, rows }) => {
  // Import dinámico: jspdf solo se descarga al exportar, no al abrir la app.
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);
  const doc = new jsPDF({ orientation: 'landscape' });

  doc.setFontSize(14);
  doc.text(title, 14, 16);

  autoTable(doc, {
    startY: 22,
    head: [columns.map((column) => column.header)],
    body: rows.map((row) => columns.map((column) => row[column.key] ?? '')),
    headStyles: { fillColor: [8, 141, 79] },
    styles: { fontSize: 9 },
  });

  doc.save(`${fileName}.pdf`);
};

export const formatFecha = (value) => (value ? new Date(value).toLocaleDateString('es-VE') : '');
