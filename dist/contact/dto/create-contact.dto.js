"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateContactDto = exports.RelationShip = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
var RelationShip;
(function (RelationShip) {
    RelationShip["friend"] = "Amigo(a)";
    RelationShip["family"] = "Familiares";
    RelationShip["colleague"] = "Colega de trabalho";
    RelationShip["acquaintance"] = "Conhecido(a)";
    RelationShip["neighbor"] = "Vizinho(a)";
    RelationShip["another"] = "Outros";
})(RelationShip || (exports.RelationShip = RelationShip = {}));
class CreateContactDto {
    constructor() {
        this.relationship = RelationShip.friend;
    }
}
exports.CreateContactDto = CreateContactDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsInstance)(Date),
    (0, class_validator_1.MaxDate)(new Date()),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? new Date(value) : value),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateContactDto.prototype, "birthdate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: RelationShip, default: RelationShip.friend }),
    (0, class_validator_1.IsEnum)(RelationShip),
    __metadata("design:type", String)
], CreateContactDto.prototype, "relationship", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateContactDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateContactDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=create-contact.dto.js.map