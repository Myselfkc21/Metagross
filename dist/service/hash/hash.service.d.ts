export declare class HashService {
    hashPassword(password: string): Promise<any>;
    comparePassword(password: string, hash: string): Promise<any>;
}
