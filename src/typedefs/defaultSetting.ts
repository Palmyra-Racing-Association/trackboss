import { ErrorResponse } from './errorResponse';

export type DefaultSetting = {
    settingId: number,
    settingName: string,
    settingValue: string,
    settingType: string,
    settingDisplayName: string,
};

export type GetDefaultSettingsResponse = DefaultSetting[] | ErrorResponse;
