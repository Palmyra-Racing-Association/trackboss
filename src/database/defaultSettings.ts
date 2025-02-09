import { OkPacket, RowDataPacket } from 'mysql2';

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

export async function getDefaultSetting(id: string): Promise<DefaultSetting> {
    const sql = 'select * from default_settings where default_setting_name = ?';
    const values: string[] = [id];

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(sql, values);
    } catch (e) {
        logger.error(`DB error getting member type list: ${e}`);
        throw new Error('internal server error');
    }
    const setting: DefaultSetting = {
        settingId: results[0].default_setting_id,
        settingName: results[0].default_setting_name,
        settingValue: results[0].default_setting_value,
        settingType: results[0].default_setting_type,
        settingDisplayName: results[0].default_setting_display_name,
    };
    return setting;
}

export async function getAllDefaultSettings(): Promise<DefaultSetting[]> {
    const sql = 'select * from default_settings order by default_setting_type';

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(sql);
    } catch (e) {
        logger.error(`DB error getting member type list: ${e}`);
        throw new Error('internal server error');
    }
    const allSettings: DefaultSetting[] = results.map((setting) => ({
        settingId: setting.default_setting_id,
        settingName: setting.default_setting_name,
        settingValue: setting.default_setting_value,
        settingType: setting.default_setting_type,
        settingDisplayName: setting.default_setting_display_name,
    }));
    return allSettings;
}

export async function deleteDefaultSetting(id: number): Promise<void> {
    const values = [id];

    let result;
    try {
        [result] = await getPool().query<OkPacket>('delete from default_settings where default_setting_id = ?', values);
    } catch (e) {
        logger.error(`DB error deleting default setting: ${e}`);
        throw new Error('internal server error');
    }

    if (result.affectedRows < 1) {
        throw new Error('not found');
    }
}

export async function insertDefaultSetting(newSetting: DefaultSetting): Promise<number> {
    // eslint-disable-next-line max-len
    const insertSql = 'insert into default_settings (default_setting_name, default_setting_value, default_setting_type, default_setting_display_name) values (?, ?, ?, ?)';

    const values = [newSetting.settingName, newSetting.settingValue, newSetting.settingType];
    let result;
    try {
        [result] = await getPool().query<OkPacket>(insertSql, values);
    } catch (e: any) {
        if ('errno' in e) {
            switch (e.errno) {
                case 1452: // FK violation - referenced is missing
                    logger.error(`User error inserting default setting in DB: ${e}`);
                    throw new Error('user input error');
                default:
                    logger.error(`DB error inserting default setting: ${e}`);
                    throw new Error('internal server error');
            }
        } else {
            // this should not happen - errors from query should always have 'errno' field
            throw e;
        }
    }

    return result.insertId;
}

export async function updateDefaultSetting(id: number, updatedSetting: DefaultSetting): Promise<DefaultSetting> {
    const updateSql =
        'update default_settings set default_setting_name = ?, default_setting_value = ?, ' +
        'default_setting_type = ?, default_setting_display_name = ? where default_setting_id = ?';
    const values = [updatedSetting.settingName, updatedSetting.settingValue,
        updatedSetting.settingType, updatedSetting.settingDisplayName, updatedSetting.settingId];
    let result;
    try {
        [result] = await getPool().query<OkPacket>(updateSql, values);
    } catch (e: any) {
        if ('errno' in e) {
            switch (e.errno) {
                case 1451: // FK violation - referenced somewhere else
                case 1452: // FK violation - referenced is missing
                    logger.error(`User error patching default setting in DB: ${e}`);
                    throw new Error('user input error');
                default:
                    logger.error(`DB error patching bdefault setting: ${e}`);
                    throw new Error('internal server error');
            }
        } else {
            // this should not happen - errors from query should always have 'errno' field
            throw e;
        }
    }

    if (result.affectedRows < 1) {
        throw new Error('not found');
    }
    const newValue = await getDefaultSetting(updatedSetting.settingName);
    return newValue;
}
