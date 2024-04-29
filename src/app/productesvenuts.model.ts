export class Productesvenuts {
  idproductevenut: number;
  idproducte_productevenut: number;
  nom_producte_venut: string;
  cantitat_producte_venut: number;
  preuTotal_producte_venut: number;
  data_producte_venut: Date;
  cantitat_descompte: number;
  usuari_compradors: string;

  constructor(idproductevenut :number ,idproducte_productevenut: number, nom_producte_venut: string, cantitat_producte_venut: number, preuTotal_producte_venut: number,data_producte_venut: Date, cantitat_descompte: number, usuari_compradors: string) {
    this.idproductevenut = idproductevenut
    this.idproducte_productevenut = idproducte_productevenut;
    this.nom_producte_venut = nom_producte_venut;
    this.cantitat_producte_venut = cantitat_producte_venut;
    this.preuTotal_producte_venut = preuTotal_producte_venut;
    this.data_producte_venut = data_producte_venut;
    this.cantitat_descompte = cantitat_descompte;
    this.usuari_compradors = usuari_compradors;
  }
}

