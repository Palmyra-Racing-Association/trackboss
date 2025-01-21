import { RowDataPacket } from 'mysql2';

import logger from '../logger';
import { getPool } from './pool';
import { DefaultSetting } from '../typedefs/defaultSetting';

export async function getDefaultSettingValue(id: string): Promise<string> {
    const sql = 'select * from default_settings where setting_type = ?';
    const values: string[] = [id];

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(sql, values);
    } catch (e) {
        logger.error(`DB error getting member type list: ${e}`);
        throw new Error('internal server error');
    }
    return results[0].setting_value;
}

export async function getDefaultSetting(id: string) : Promise<DefaultSetting> {
    const sql = 'select * from default_settings where setting_type = ?';
    const values: string[] = [id];

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(sql, values);
    } catch (e) {
        logger.error(`DB error getting member type list: ${e}`);
        throw new Error('internal server error');
    }
    const setting : DefaultSetting = {
        settingId: results[0].default_setting_id,
        settingName: results[0].setting_type,
        settingValue: results[0].setting_value,
    };
    return setting;
}
