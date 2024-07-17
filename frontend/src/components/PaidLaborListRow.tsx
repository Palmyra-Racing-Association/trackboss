/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { ExpanderComponentProps } from 'react-data-table-component';
import { Box, Button, ButtonGroup, useToast } from '@chakra-ui/react';
import { BsTrash2 } from 'react-icons/bs';

import { updatePaidLabor, deletePaidLabor } from '../controller/paidLabor';
import { UserContext } from '../contexts/UserContext';
import { PaidLabor } from '../../../src/typedefs/paidLabor';
import PaidLaborModal from './modals/PaidLaborModal';

interface PaidLaborRowProps extends ExpanderComponentProps<PaidLabor> {
    // eslint-disable-next-line react/require-default-props
    updateCallback?: () => void,
}

export default function PaidLaborListRow(props: PaidLaborRowProps) {
    const { state } = useContext(UserContext);
    // const toast = useToast();
    const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
    return (
        <Box>
            <ButtonGroup variant="outline" ml={10} spacing="6">
                <Button
                    aria-label="Remove"
                    background="red"
                    color="white"
                    rightIcon={<BsTrash2 />}
                    onClick={
                        async () => {
                            await deletePaidLabor(state.token, props.data.paidLaborId);
                            if (props.updateCallback) {
                                await props.updateCallback();
                            }
                        }
                    }
                >
                    Delete
                </Button>

                <Button
                    background="orange.300"
                    color="white"
                    style={{ visibility: state.user?.memberType === 'Admin' ? 'visible' : 'hidden' }}
                    onClick={
                        async () => {
                            setIsEditOpen(true);
                        }
                    }
                >
                    Edit Paid Labor
                </Button>
            </ButtonGroup>
            <PaidLaborModal
                isOpen={isEditOpen}
                onClose={
                    async () => {
                        if (props.updateCallback) {
                            props.updateCallback();
                        }
                    }
                }
            />
        </Box>
    );
}
