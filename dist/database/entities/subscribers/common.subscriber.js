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
exports.CommonSubscriber = void 0;
const typeorm_1 = require("typeorm");
const slugify_1 = require("slugify");
const config = require("config");
const luxon_1 = require("luxon");
const hash_service_1 = require("../../../service/hash/hash.service");
let CommonSubscriber = class CommonSubscriber {
    dataSource;
    hashService;
    constructor(dataSource, hashService) {
        this.dataSource = dataSource;
        this.hashService = hashService;
        this.dataSource.subscribers.push(this);
    }
    getSlugField = (entity) => {
        return entity?.name || entity?.title;
    };
    async beforeInsert(event) {
        if (!event.entity)
            return;
        const columns = event.metadata.columns.map((column) => column.propertyName);
        if (columns.includes('slug')) {
            let slugField = this.getSlugField(event.entity);
            let slug = (0, slugify_1.default)(slugField, { lower: true });
            const manager = this.dataSource.manager;
            const regexPattern = `^${slug}(-?\\d+)?$`;
            const count = await manager
                .getRepository(event.metadata.target)
                .createQueryBuilder('e')
                .where('e.slug REGEXP :regex', { regex: regexPattern })
                .getCount();
            if (count) {
                slug = `${slug}-${count}`;
            }
            event.entity.slug = slug;
        }
        if (columns.includes('uuid')) {
            event.entity.uuid = this.generateUuId('TXN');
        }
        if (columns.includes('password')) {
            event.entity.password = await this.hashService.hashPassword(event.entity.password);
        }
        this.cleanEntity(event.entity);
    }
    cleanEntity(entity) {
        ['$avatar_path', '$avatar_url', '$avatar_default', '$private_file'].forEach((key) => delete entity[key]);
        return entity;
    }
    async beforeUpdate(event) {
        const columns = event.metadata.columns.map((column) => column.propertyName);
        if (!columns.includes('avatar'))
            return;
        if (event?.entity?.avatar !== event.databaseEntity.avatar)
            this.cleanEntity(event.entity);
    }
    async afterInsert(event) {
        const columns = event.metadata.columns.map((column) => column.propertyName);
        if (!columns.includes('avatar'))
            return;
        await this.handleImageProcessing(event.entity);
    }
    async afterUpdate(event) {
        const columns = event.metadata.columns.map((column) => column.propertyName);
        if (!columns.includes('avatar') || !event.entity)
            return;
        event.entity.PRIVATE_FILE = event.databaseEntity.PRIVATE_FILE;
        await this.handleImageProcessing(event.entity);
    }
    async handleImageProcessing(entity) {
        if (!entity.avatar) {
            entity.avatar_url = null;
            return;
        }
    }
    async afterLoad(entity, event) {
        const columns = event.metadata.columns.map((column) => column.propertyName);
        for (let column of columns) {
            if ((column.includes('_date') || column.includes('_at')) &&
                entity[column]) {
                const date = luxon_1.DateTime.fromJSDate(entity[column]);
                const dayWithOrdinal = date.day + this.getOrdinalSuffix(date.day);
                entity[`$formatted_${column}`] =
                    `${dayWithOrdinal} ${date.toFormat(config.get('date_format') || 'LLL yy')}`;
            }
        }
        await this.handleImageProcessing(entity);
    }
    getOrdinalSuffix(day) {
        if (day > 3 && day < 21)
            return 'th';
        switch (day % 10) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    }
    generateUuId(tableName) {
        let prefixName = tableName;
        const timestamp = Date.now();
        const randomPart = Math.floor(Math.random() * 100000);
        const uniqueNumber = (timestamp + randomPart) % 100000;
        let uuid = uniqueNumber.toString().padStart(5, '0');
        return `#${prefixName}${uuid}`;
    }
};
exports.CommonSubscriber = CommonSubscriber;
exports.CommonSubscriber = CommonSubscriber = __decorate([
    (0, typeorm_1.EventSubscriber)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        hash_service_1.HashService])
], CommonSubscriber);
//# sourceMappingURL=common.subscriber.js.map