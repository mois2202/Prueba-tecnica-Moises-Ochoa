import React from 'react';
import { Document as PDFDocument, Page as PDFPage, Text as PDFText, View as PDFView, StyleSheet } from '@react-pdf/renderer';
import type { Project } from '../../../projects/domain/project.types';

const Document = PDFDocument as any;
const Page = PDFPage as any;
const Text = PDFText as any;
const View = PDFView as any;
import type { Task } from '../../../tasks/domain/task.types';

// Styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#1e293b',
    backgroundColor: '#ffffff',
  },
  header: {
    borderBottom: '2px solid #6366f1',
    paddingBottom: 15,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  headerDate: {
    fontSize: 8,
    color: '#64748b',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0f172a',
  },
  section: {
    marginBottom: 20,
  },
  kpiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    gap: 15,
  },
  kpiCard: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
  },
  kpiTitle: {
    fontSize: 8,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    minHeight: 24,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#f1f5f9',
    fontWeight: 'bold',
    color: '#334155',
  },
  col1: { width: '30%', paddingLeft: 8, fontWeight: 'bold' },
  col2: { width: '40%', paddingLeft: 8 },
  col3: { width: '15%', textAlign: 'center' },
  col4: { width: '15%', textAlign: 'center', paddingRight: 8 },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: '1px solid #e2e8f0',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: '#94a3b8',
    fontSize: 8,
  },
});

interface ExecutiveReportDocumentProps {
  projects: Project[];
  tasks: Task[];
}

export const ExecutiveReportDocument: React.FC<ExecutiveReportDocumentProps> = ({ projects, tasks }) => {
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.estado.toLowerCase() === 'completada').length;
  const globalCompletion = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header} fixed>
          <View>
            <Text style={styles.headerTitle}>Resumen Ejecutivo de Proyectos</Text>
            <Text style={{ fontSize: 9, color: '#64748b', marginTop: 2 }}>ProjectManager Analytics Platform</Text>
          </View>
          <Text style={styles.headerDate}>Generado el: {new Date().toLocaleDateString('es-ES')}</Text>
        </View>

        {/* Global KPIs */}
        <View style={styles.section}>
          <Text style={styles.title}>Métricas Globales</Text>
          <View style={styles.kpiContainer}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiTitle}>Total Proyectos</Text>
              <Text style={styles.kpiValue}>{totalProjects}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiTitle}>Total Tareas</Text>
              <Text style={styles.kpiValue}>{totalTasks}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiTitle}>Tareas Completadas</Text>
              <Text style={styles.kpiValue}>{completedTasks}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiTitle}>Avance General</Text>
              <Text style={styles.kpiValue}>{globalCompletion}%</Text>
            </View>
          </View>
        </View>

        {/* Projects Table */}
        <View style={styles.section}>
          <Text style={styles.title}>Desglose de Proyectos</Text>
          <View style={styles.table}>
            {/* Header Row */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.col1}>Proyecto</Text>
              <Text style={styles.col2}>Descripción</Text>
              <Text style={styles.col3}>Límite</Text>
              <Text style={styles.col4}>Progreso</Text>
            </View>

            {/* Data Rows */}
            {projects.map((project) => {
              const projectTasks = tasks.filter((t) => {
                const projId = typeof t.proyecto === 'object' && t.proyecto !== null ? t.proyecto._id : t.proyecto;
                return projId === project._id;
              });
              const projTotal = projectTasks.length;
              const projCompleted = projectTasks.filter((t) => t.estado.toLowerCase() === 'completada').length;
              const projCompletion = projTotal ? Math.round((projCompleted / projTotal) * 100) : 0;

              return (
                <View key={project._id} style={styles.tableRow} wrap={false}>
                  <Text style={styles.col1}>{project.nombre}</Text>
                  <Text style={styles.col2}>{project.descripcion || 'Sin descripción'}</Text>
                  <Text style={styles.col3}>{formatDate(project.fechaLimite)}</Text>
                  <Text style={styles.col4}>
                    {projCompletion}% ({projCompleted}/{projTotal})
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>© ProjectManager Platform. Todos los derechos reservados.</Text>
          <Text render={({ pageNumber, totalPages }: { pageNumber: number; totalPages: number | null }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};
