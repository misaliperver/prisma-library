import { join } from "path";
import { config } from 'dotenv';

const envPath: string = join(require.main.path, '..', '..', '..', 'env', '.local.app.env');

console.log(envPath);

export class ConfigBase {
    private static configBuild = process.env.RELEASE ? null : config({path: envPath});
}