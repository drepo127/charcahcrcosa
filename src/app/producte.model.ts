export class Producte {
  id_producto: number;
  nombre_producto: string;
  descripcion_producto: string;
  cantidad: number;
  precio_producto: number;
  cantidad_descuento: number;
  imagen_producto: string;
  tipo_producto: string;
  total_compra_producto: number;

  constructor(id_producto: number, nombre_producto: string, descripcion_producto: string, cantidad: number, precio_producto: number, cantidad_descuento: number, imagen_producto: string, tipo_producto: string, total_compra_producto: number) {
    this.id_producto = id_producto;
    this.nombre_producto = nombre_producto;
    this.descripcion_producto = descripcion_producto;
    this.cantidad = cantidad;
    this.precio_producto = precio_producto;
    this.cantidad_descuento = cantidad_descuento;
    this.imagen_producto = imagen_producto;
    this.tipo_producto = tipo_producto;
    this.total_compra_producto = total_compra_producto;
  }
}
