/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import {
    Box, Text, Button, Heading, HStack, Menu, MenuButton, MenuItem, MenuList, VStack, useDisclosure,
    Input, SimpleGrid,
} from '@chakra-ui/react';
import { UserContext } from '../../contexts/UserContext';
import { DefaultSetting } from '../../../../src/typedefs/defaultSetting';
import { getDefaultSettingsList, updateDefaultSetting } from '../../controller/defaultSettings';
import WrappedSwitchInput from '../input/WrappedSwitchInput';

function SiteSettings() {
    const { state } = useContext(UserContext);
    const isAdminUser = state.user?.memberType === 'Admin';
    const [defaultSettings, setDefaultSettings] = useState<DefaultSetting[]>();

    async function getSettingsData() {
        let allSettings : DefaultSetting[] = [];
        try {
            allSettings = await getDefaultSettingsList(state.token) as DefaultSetting[];
        } catch (error) {
            // console.log(error);
        }
        setDefaultSettings(allSettings);
    }

    useEffect(() => {
        getSettingsData();
    }, []);

    function invertBooleanString(str:string) {
        let flipped = '';
        if (str === 'true') {
            flipped = 'false';
        }
        if (str === 'false') {
            flipped = 'true';
        }
        return flipped;
    }

    return (
        <SimpleGrid columns={2} spacing={10}>
            {
                // eslint-disable-next-line arrow-body-style
                defaultSettings?.map((setting) => {
                    let settingInput;
                    if (setting.settingType === 'boolean') {
                        settingInput = (
                            <WrappedSwitchInput
                                maxWidth={150}
                                defaultChecked={setting.settingValue === 'true'}
                                wrapperText={setting.settingDisplayName}
                                toastMessage={`Changed setting ${setting.settingName}`}
                                onSwitchChange={
                                    async () => {
                                        const updatedSetting = {
                                            settingId: setting.settingId,
                                            settingName: setting.settingName,
                                            settingType: setting.settingType,
                                            settingValue: invertBooleanString(setting.settingValue),
                                            settingDisplayName: setting.settingDisplayName,
                                        };
                                        await updateDefaultSetting(state.token, updatedSetting);
                                    }
                                }
                            />
                        );
                    } else if (setting.settingType === 'string') {
                        settingInput = (
                            <Box>
                                <Text>{setting.settingDisplayName}</Text>
                                <Input
                                    variant="outline"
                                    placeholder={setting.settingValue}
                                    onChange={
                                        async (e) => {
                                            const updatedSetting = {
                                                settingId: setting.settingId,
                                                settingName: setting.settingName,
                                                settingType: setting.settingType,
                                                settingValue: e.target.value,
                                                settingDisplayName: setting.settingDisplayName,
                                            };
                                            await updateDefaultSetting(state.token, updatedSetting);
                                        }
                                    }
                                />
                            </Box>
                        );
                    }
                    return settingInput;
                })
            }
        </SimpleGrid>
    );
}
export default SiteSettings;
