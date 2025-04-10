export declare enum Status {
    pending = "Pendente",
    sent = "Enviado",
    failed = "Falhou"
}
export declare class CreateNotificationDto {
    id?: string;
    userId: string;
    contactId: string;
    message?: string;
    sentAt?: Date;
    status: Status;
    createdAt: Date;
    updatedAt: Date;
}
