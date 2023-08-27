import { ConfigBase } from './common/config/config';
import { get } from 'env-var';

export class ApiServerConfig extends ConfigBase {

    public static readonly HOST: string = get('API_HOST').required().asString();

    public static readonly PORT: number = get('API_PORT').required().asPortNumber();

    public static readonly LOG_ENABLE: boolean = get('API_LOG_ENABLE').required().asBool();

    public static readonly DOC_PATH: string = 'docs';

}
