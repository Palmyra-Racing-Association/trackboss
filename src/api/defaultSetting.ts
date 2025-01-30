import { Request, Response, Router } from 'express';
import {
    DefaultSetting,
    GetDefaultSettingsResponse,
} from '../typedefs/defaultSetting';
import {
    getDefaultSetting, getAllDefaultSettings, getDefaultSettingValue,
    deleteDefaultSetting, insertDefaultSetting,
    updateDefaultSetting,
} from '../database/defaultSettings';
import { checkHeader, validateAdminAccess } from '../util/auth';
import logger from '../logger';

const defaultSetting = Router();

defaultSetting.get('/', async (req: Request, res: Response) => {
    let response: GetDefaultSettingsResponse;
    try {
        await validateAdminAccess(req, res);
        const links: DefaultSetting[] = await getAllDefaultSettings();
        res.status(200);
        response = links;
        res.send(response);
    } catch (e: any) {
        logger.error(`Error at path ${req.path}`);
        logger.error(e);
        if (e.message === 'Authorization Failed') {
            res.status(401);
            response = { reason: 'not authorized' };
        } else {
            res.status(500);
            response = { reason: 'internal server error' };
        }
        res.send(response);
    }
});

defaultSetting.get('/:settingName', async (req: Request, res: Response) => {
    try {
        await validateAdminAccess(req, res);
        const { settingName } = req.params;
        const setting = await getDefaultSetting(settingName);
        res.send(setting);
    } catch (error: any) {
        logger.error(`Error at path ${req.path}`);
        logger.error(error);
        res.status(500);
        res.send(error);
    }
});

defaultSetting.put('/:id', async (req: Request, res: Response) => {
    try {
        await validateAdminAccess(req, res);
        const patchedSetting = await updateDefaultSetting(Number(req.params.id), req.body);
        res.json(patchedSetting);
    } catch (error: any) {
        logger.error(`Error at path ${req.path}`);
        logger.error(error);
        res.status(500);
        res.send(error);
    }
});

defaultSetting.post('/', async (req: Request, res: Response) => {
    try {
        await validateAdminAccess(req, res);
        const newSetting : DefaultSetting = req.body;
        await insertDefaultSetting(newSetting);
        const savedNewSetting = await getDefaultSetting(newSetting.settingName);
        res.json(savedNewSetting);
    } catch (error: any) {
        logger.error(`Error at path ${req.path}`);
        logger.error(error);
        res.status(500);
        res.send(error);
    }
});

defaultSetting.delete('/:id', async (req: Request, res: Response) => {
    try {
        await validateAdminAccess(req, res);
        await deleteDefaultSetting(Number(req.params.id));
        res.status(200);
        res.send('deleted default setting');
    } catch (error: any) {
        logger.error(`Error at path ${req.path}`);
        logger.error(error);
        res.status(500);
        res.send(error);
    }
});

export default defaultSetting;
