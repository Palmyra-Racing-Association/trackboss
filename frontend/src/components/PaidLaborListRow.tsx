/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { ExpanderComponentProps } from 'react-data-table-component';
import { Box, Button, ButtonGroup, useToast } from '@chakra-ui/react';
import { BsTrash2 } from 'react-icons/bs';

import MemberSelector from './shared/MemberSelector';
import { PatchBoardMemberRequest } from '../../../src/typedefs/boardMember';
import { updateBoardMember } from '../controller/boardMember';
import { deletePaidLabor } from '../controller/paidLabor';
import { UserContext } from '../contexts/UserContext';
import { PaidLabor } from '../../../src/typedefs/paidLabor';

interface PaidLaborRowProps extends ExpanderComponentProps<PaidLabor> {
    // eslint-disable-next-line react/require-default-props
    updateCallback?: () => void,
}

export default function PaidLaborListRow(props: PaidLaborRowProps) {
    const { state } = useContext(UserContext);
    const [selectedOption, setSelectedOption] = useState<any>();
    // const toast = useToast();

    useEffect(() => {
        async function updateBoardMemberRow() {
            if (selectedOption) {
                /*
                const updateBoard: PatchBoardMemberRequest = {
                    year: props.year,
                    memberId: selectedOption.value,
                };
                */
                try {
                    // await updateBoardMember(state.token, props.data.boardId, updateBoard);
                } catch (error) {
                    /*
                    toast({
                        containerStyle: {
                            background: 'orange',
                        },
                        // eslint-disable-next-line max-len
                        title: `Unable to change board member ${props.data.title}`,
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                    */
                }
                if (props.updateCallback) {
                    props.updateCallback();
                }
            }
        }
        updateBoardMemberRow();
    }, [selectedOption]);

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
                            // await removeSignup(state.token, jobId);
                            // await props.refreshData();
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
                            // onEditPointsOpen();
                            // await props.refreshData();
                        }
                    }
                >
                    Edit Paid Labor
                </Button>
            </ButtonGroup>
        </Box>
    );
}
