import React, { useContext, useEffect, useState } from 'react';
import { Button, useDisclosure, VStack } from '@chakra-ui/react';
import DataTable from 'react-data-table-component';

import { MemberCommunication } from '../../../src/typedefs/memberCommunication';
import { MembershipTag } from '../../../src/typedefs/membershipTag';

import { getCommunications } from '../controller/communication';
import { UserContext } from '../contexts/UserContext';
import { getUniqueTags } from '../controller/membershipTags';

import dataTableStyles from './shared/DataTableStyles';
import CreateCommunicationModal from './modals/CreateCommunicationModal';

export default function CommunicationsList() {
    const { state } = useContext(UserContext);
    const [allCommunications, setAllCommunications] = useState<MemberCommunication[]>();
    const [uniqueTags, setUniqueTags] = useState<MembershipTag[]>();

    const { isOpen, onClose, onOpen } = useDisclosure();

    async function initCommunicationsData() {
        const allCommunicationsData = await getCommunications(state.token);
        setAllCommunications(allCommunicationsData);
        const allTags = await getUniqueTags(state.token);
        setUniqueTags(allTags);
    }

    useEffect(() => {
        initCommunicationsData();
    }, []);

    const columns: any = [
        {
            name: 'Subject',
            selector: (row: MemberCommunication) => row.subject,
            sortable: true,
            maxWidth: '10',
        },
        {
            name: 'Sender',
            selector: (row: MemberCommunication) => row.senderId,
            sortable: true,
            maxWidth: '10',
        },
        {
            name: 'Mechanism',
            selector: (row: MemberCommunication) => row.mechanism,
            sortable: true,
            maxWidth: '10',
        },
    ];

    return (
        <VStack mt={5} ml={5}>
            <Button
                backgroundColor="orange"
                color="white"
                onClick={
                    () => {
                        onOpen();
                    }
                }
            >
                New Communication
            </Button>
            <DataTable
                columns={columns}
                data={allCommunications as MemberCommunication[]}
                customStyles={dataTableStyles()}
                onRowClicked={
                    (row: MemberCommunication) => {
                        alert(JSON.stringify(row));
                    }
                }
                fixedHeaderScrollHeight="300px"
                highlightOnHover
                pagination
                paginationPerPage={50}
                paginationRowsPerPageOptions={[50, (allCommunications?.length || 999)]}
                responsive
                striped
                subHeaderWrap
                defaultSortFieldId={1}
            />
            <CreateCommunicationModal
                isOpen={isOpen}
                onClose={onClose}
                tags={uniqueTags}
                userId={state.user?.memberId || 0}
                token={state.token}
            />
        </VStack>
    );
}
