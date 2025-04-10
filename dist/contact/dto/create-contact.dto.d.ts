export declare enum RelationShip {
    friend = "Amigo(a)",
    family = "Familiares",
    colleague = "Colega de trabalho",
    acquaintance = "Conhecido(a)",
    neighbor = "Vizinho(a)",
    another = "Outros"
}
export declare class CreateContactDto {
    id?: string;
    userId?: string;
    name: string;
    birthdate: Date;
    relationship: RelationShip;
    createdAt: Date;
    updatedAt: Date;
}
