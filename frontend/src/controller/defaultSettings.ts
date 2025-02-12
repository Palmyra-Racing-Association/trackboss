import {
    GetDefaultSettingsResponse,
    DefaultSetting,
} from '../../../src/typedefs/defaultSetting';
import { generateHeaders } from './utils';

export async function getDefaultSettingsList(token: string): Promise<GetDefaultSettingsResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/defaultSettings`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function getDefaultSettingsByName(token: string, name: string): Promise<DefaultSetting> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/defaultSettings/${name}`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function getApplicationSetting(): Promise<DefaultSetting> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/defaultSettings/applications/enabled`, {
        method: 'GET',
        mode: 'cors',
    });
    return response.json();
}

export async function deleteDefaultSetting(token: string, id:number): Promise<any> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/defaultSettings/${id}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

// eslint-disable-next-line max-len
export async function updateDefaultSetting(token: string, setting: DefaultSetting) : Promise<GetDefaultSettingsResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/defaultSettings/${setting.settingId}`, {
        method: 'PUT',
        mode: 'cors',
        headers: generateHeaders(token),
        body: JSON.stringify(setting),
    });
    return response.json();
}

export async function createDefaultSetting(token: string, setting: DefaultSetting) : Promise<DefaultSetting> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/defaultSettings`, {
        method: 'POST',
        mode: 'cors',
        headers: generateHeaders(token),
        body: JSON.stringify(setting),
    });
    return response.json();
}
