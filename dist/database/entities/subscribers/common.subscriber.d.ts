import { DataSource, EntitySubscriberInterface, InsertEvent, LoadEvent, UpdateEvent } from 'typeorm';
import { HashService } from 'src/service/hash/hash.service';
export declare class CommonSubscriber implements EntitySubscriberInterface<any> {
    private readonly dataSource;
    private readonly hashService;
    constructor(dataSource: DataSource, hashService: HashService);
    getSlugField: (entity: any) => any;
    beforeInsert(event: InsertEvent<any>): Promise<void>;
    cleanEntity(entity: any): any;
    beforeUpdate(event: UpdateEvent<any>): Promise<void>;
    afterInsert(event: InsertEvent<any>): Promise<void>;
    afterUpdate(event: UpdateEvent<any>): Promise<void>;
    handleImageProcessing(entity: any): Promise<void>;
    afterLoad(entity: any, event: LoadEvent<any>): Promise<void>;
    getOrdinalSuffix(day: number): string;
    generateUuId(tableName: string): string;
}
