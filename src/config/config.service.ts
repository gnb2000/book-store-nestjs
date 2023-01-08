import * as fs from 'fs';
import { parse } from 'dotenv';

export class ConfigService{
    private readonly envConfig: {[key: string] : string}; //Es un objeto que tiene una key que es un string y esta variable va a retornar un String

    constructor() {
        const isDevelopmentEnv = process.env.NODE_ENV !== "production"; //Esta variable de entorno solo esta en produccion

        if (isDevelopmentEnv){
            const envFilePath = __dirname + '/../../.env';
            const existsPath = fs.existsSync(envFilePath);

            if (!existsPath){
                console.log('.env file does not exist');
                process.exit(0);
            }

            this.envConfig = parse(fs.readFileSync(envFilePath));
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