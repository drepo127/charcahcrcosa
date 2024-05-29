export class Productosvendidos {
    idproducte_productevenut: number;
    nom_producte_venut: string;
    cantitat_producte_venut: number;
    preuTotal_producte_venut: number;
    cantitat_descompte: number;
    usuari_compradors: string;
    crypto: string;
    quant_crypto: number;

    constructor(idproducte_productevenut: number, nom_producte_venut: string, cantitat_producte_venut: number, preuTotal_producte_venut: number, cantitat_descompte: number, usuari_compradors: string, crypto: string, quant_crypto: number) {
        this.idproducte_productevenut = idproducte_productevenut;
        this.nom_producte_venut = nom_producte_venut;
        this.cantitat_producte_venut = cantitat_producte_venut;
        this.preuTotal_producte_venut = preuTotal_producte_venut;
        this.cantitat_descompte = cantitat_descompte;
        this.usuari_compradors = usuari_compradors;
        this.crypto = crypto;
        this.quant_crypto = quant_crypto;
    }
}
