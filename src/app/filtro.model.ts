export class Filtro {
  nombre_filtro: string;
  filtro_encendido: boolean;

  constructor(nombre_filtro: string, filtro_encendido: boolean) {
    this.nombre_filtro = nombre_filtro;
    this.filtro_encendido = filtro_encendido;
  }
}
