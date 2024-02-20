import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export interface Producto {
  prodName: string;
  prodPreu: number;
  cantidadProducto: number;
  rutaImagen: String;
}
@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private productosSubject = new BehaviorSubject<Producto[][]>([]);
  productos$ = this.productosSubject.asObservable();

  constructor() {}
  
  actualizarProductos(productos: Producto[][]) {
    this.productosSubject.next(productos);
    console.log('Productos actualizados en el servicio:', productos);
  }
  eliminarArrayPorNombre(prodName: string) {
    const productosActuales = this.productosSubject.value;
    const productosFiltrados = productosActuales.filter(
      arrayProductos => !arrayProductos.some(producto => producto.prodName === prodName)
    );
    this.actualizarProductos(productosFiltrados);
  }
  calcularPrecioTotalConCantidad(productos: Producto[][]): number {
    let precioTotalConCantidad = 0;

    for (let i = 0; i < productos.length; i++) {
      for (let j = 0; j < productos[i].length; j++) {
        const producto = productos[i][j];

        // Verificar si el producto y su cantidad son definidos y tienen las propiedades correctas antes de operar
        if (producto && producto.prodPreu !== undefined && producto.cantidadProducto !== undefined) {
          precioTotalConCantidad += producto.prodPreu * producto.cantidadProducto;
        } else {
          console.warn(`Advertencia: Producto no definido correctamente en el índice ${i}`);
        }
      }
    }

    return precioTotalConCantidad;
  }
}
