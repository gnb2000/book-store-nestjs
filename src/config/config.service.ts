import * as fs from 'fs';
import { parse, config } from 'dotenv';

export class ConfigService{
    private readonly envConfig: {[key: string] : string}; //Es un objeto que tiene una key que es un string y esta variable va a retornar un String

    constructor() {
        const isDevelopmentEnv = process.env.NODE_ENV !== "production"; //Esta variable de entorno solo esta en produccion

        if (isDevelopmentEnv){
            this.envConfig = config({path: '.env'}).parsed;
        } else {
            this.envConfig = {
                PORT: process.env.PORT,
            };
        }

    }

    get(key: string): string{
        return this.envConfig[key];
    }
}