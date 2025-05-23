export class Cistella {
  id_producto_cistella: number;
  usuari_afegit: string;
  nom_producte: string;
  cantitat: number;
  preu_unitat: number;
  imagen_producto: string;
  descuento_producto: number;

  constructor(id_producto_cistella: number, usuari_afegit: string, nom_producte: string, cantitat: number, preu_unitat: number, imagen_producto: string, descuento_producto: number) {
    this.id_producto_cistella = id_producto_cistella;
    this.usuari_afegit = usuari_afegit;
    this.nom_producte = nom_producte;
    this.cantitat = cantitat;
    this.preu_unitat = preu_unitat;
    this.imagen_producto = imagen_producto;
    this.descuento_producto = descuento_producto
  }
}
