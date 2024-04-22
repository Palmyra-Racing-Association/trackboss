import React, { useContext, useEffect, useState } from 'react';
import { ExpanderComponentProps } from 'react-data-table-component';
import { Box, useToast } from '@chakra-ui/react';
import MemberSelector from './shared/MemberSelector';
import { BoardMember, PatchBoardMemberRequest } from '../../../src/typedefs/boardMember';
import { updateBoardMember } from '../controller/boardMember';
import { UserContext } from '../contexts/UserContext';

interface BoardMemberRowProps extends ExpanderComponentProps<BoardMember> {
    // eslint-disable-next-line react/require-default-props
    year?: number,
    // eslint-disable-next-line react/require-default-props
    updateCallback?: () => void,
}

export default function BoardMemberListRow(props:BoardMemberRowProps) {
    const { state } = useContext(UserContext);
    const [selectedOption, setSelectedOption] = useState<any>();
    const toast = useToast();

    useEffect(() => {
        async function updateBoardMemberRow() {
            if (selectedOption) {
                const updateBoard: PatchBoardMemberRequest = {
                    boardMemberTitleId: props.data.titleId,
                    year: props.year,
                    memberId: selectedOption.value,
                };
                try {
                    await updateBoardMember(state.token, props.data.boardId, updateBoard);
                } catch (error) {
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
            <MemberSelector
                isAdmin
                setSelectedOption={setSelectedOption}
                disabled={false}
            />
        </Box>
    );
}
