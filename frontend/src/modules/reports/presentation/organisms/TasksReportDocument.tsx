import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { Project } from '../../../projects/domain/project.types';
import type { Task } from '../../../tasks/domain/task.types';

// Styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#1e293b',
    backgroundColor: '#ffffff',
  },
  header: {
    borderBottom: '2px solid #ec4899',
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
  projectSection: {
    marginBottom: 25,
  },
  projectHeader: {
    backgroundColor: '#f8fafc',
    padding: 8,
    borderLeft: '3px solid #ec4899',
    marginBottom: 10,
  },
  projectName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  projectDesc: {
    fontSize: 8,
    color: '#64748b',
    marginTop: 2,
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
    minHeight: 22,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#f1f5f9',
    fontWeight: 'bold',
    color: '#334155',
  },
  col1: { width: '25%', paddingLeft: 8, fontWeight: 'bold' },
  col2: { width: '35%', paddingLeft: 8 },
  col3: { width: '13%', textAlign: 'center', textTransform: 'uppercase' },
  col4: { width: '13%', textAlign: 'center', textTransform: 'uppercase' },
  col5: { width: '14%', textAlign: 'center', paddingRight: 8 },
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

interface TasksReportDocumentProps {
  projects: Project[];
  tasks: Task[];
}

export const TasksReportDocument: React.FC<TasksReportDocumentProps> = ({ projects, tasks }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Sin fecha';
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
            <Text style={styles.headerTitle}>Reporte Detallado de Tareas</Text>
            <Text style={{ fontSize: 9, color: '#64748b', marginTop: 2 }}>ProjectManager Analytics Platform</Text>
          </View>
          <Text style={styles.headerDate}>Generado el: {new Date().toLocaleDateString('es-ES')}</Text>
        </View>

        {/* Group tasks by project */}
        {projects.map((project) => {
          const projectTasks = tasks.filter((t) => {
            const projId = typeof t.proyecto === 'object' && t.proyecto !== null ? t.proyecto._id : t.proyecto;
            return projId === project._id;
          });

          if (projectTasks.length === 0) return null;

          return (
            <View key={project._id} style={styles.projectSection} wrap={false}>
              {/* Project Header Info */}
              <View style={styles.projectHeader}>
                <Text style={styles.projectName}>{project.nombre}</Text>
                <Text style={styles.projectDesc}>
                  {project.descripcion || 'Sin descripción'} — Fecha límite: {formatDate(project.fechaLimite)}
                </Text>
              </View>

              {/* Tasks Table */}
              <View style={styles.table}>
                {/* Header Row */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.col1}>Tarea</Text>
                  <Text style={styles.col2}>Descripción</Text>
                  <Text style={styles.col3}>Estado</Text>
                  <Text style={styles.col4}>Prioridad</Text>
                  <Text style={styles.col5}>Vencimiento</Text>
                </View>

                {/* Data Rows */}
                {projectTasks.map((task) => (
                  <View key={task._id} style={styles.tableRow}>
                    <Text style={styles.col1}>{task.titulo}</Text>
                    <Text style={styles.col2}>{task.descripcion || '-'}</Text>
                    <Text style={styles.col3}>{task.estado}</Text>
                    <Text style={styles.col4}>{task.prioridad}</Text>
                    <Text style={styles.col5}>{formatDate(task.fechaVencimiento)}</Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>© ProjectManager Platform. Todos los derechos reservados.</Text>
          <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};
