import { RowDataPacket } from 'mysql2';

import logger from '../logger';
import { getPool } from './pool';
import { Link } from '../typedefs/link';

// eslint-disable-next-line import/prefer-default-export
export async function getLinks(): Promise<Link[]> {
    const sql = 'select * from link order by display_order';
    const values: string[] = [];

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(sql, values);
    } catch (e) {
        logger.error(`DB error getting member type list: ${e}`);
        throw new Error('internal server error');
    }
    return results.map((result) => ({
        linkId: result.link_id,
        linkTitle: result.link_title,
        linkUrl: result.link_url,
        linkDisplayOrder: result.display_order,
    }));
}
