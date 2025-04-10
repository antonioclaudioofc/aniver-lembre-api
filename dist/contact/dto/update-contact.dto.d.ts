export declare enum RelationShip {
    friend = "Amigo(a)",
    family = "Familiares",
    colleague = "Colega de trabalho",
    acquaintance = "Conhecido(a)",
    neighbor = "Vizinho(a)",
    another = "Outros"
}
export declare class UpdateContactDto {
    name: string;
    birthdate: Date;
    relationship: RelationShip;
}
