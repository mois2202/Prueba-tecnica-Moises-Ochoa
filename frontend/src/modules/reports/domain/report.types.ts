export interface StatsSummary {
  totalProyectos: number;
  totalTareas: number;
  porcentajeCompletado: number;
}

export interface StatusItem {
  estado: string;
  cantidad: number;
}

export interface RiskItem {
  _id: string;
  tareasPendientes: number;
  nombre: string;
}

export interface ProductivityItem {
  fecha: string;
  cantidad: number;
}

export interface ReportData {
  resumenGlobal: StatsSummary;
  distribucionEstados: StatusItem[];
  alertasRiesgo: RiskItem[];
  productividadHistorica: ProductivityItem[];
}
