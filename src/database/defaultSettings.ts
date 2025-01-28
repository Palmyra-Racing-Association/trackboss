import { RowDataPacket } from 'mysql2';

import logger from '../logger';
import { getPool } from './pool';
import { DefaultSetting } from '../typedefs/defaultSetting';

export async function getDefaultSettingValue(settingName: string): Promise<string> {
    const sql = 'select * from default_settings where default_setting_name = ?';
    const values: string[] = [settingName];

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(sql, values);
    } catch (e) {
        logger.error(`DB error getting member type list: ${e}`);
        throw new Error('internal server error');
    }
    return results[0].default_setting_value;
}

export async function getDefaultSetting(id: string) : Promise<DefaultSetting> {
    const sql = 'select * from default_settings where default_setting_name = ?';
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
        settingName: results[0].default_setting_name,
        settingValue: results[0].default_setting_value,
        settingType: results[0].default_setting_type,
    };
    return setting;
}

export async function getAllDefaultSettings() : Promise<DefaultSetting[]> {
    const sql = 'select * from default_settings';

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(sql);
    } catch (e) {
        logger.error(`DB error getting member type list: ${e}`);
        throw new Error('internal server error');
    }
    const allSettings : DefaultSetting[] = results.map((setting) => ({
        settingId: setting.default_setting_id,
        settingName: setting.default_setting_name,
        settingValue: setting.default_setting_value,
        settingType: setting.default_setting_type,
    }));
    return allSettings;
}
