import React, { useContext, useEffect, useState } from 'react';
import { Button, VStack } from '@chakra-ui/react';
import DataTable from 'react-data-table-component';

import { MemberCommunication } from '../../../src/typedefs/memberCommunication';

import { getCommunications } from '../controller/communication';
import { UserContext } from '../contexts/UserContext';

import dataTableStyles from './shared/DataTableStyles';

export default function CommunicationsList() {
    const { state } = useContext(UserContext);
    const [allCommunications, setAllCommunications] = useState<MemberCommunication[]>();

    async function initCommunicationsData() {
        const allCommunicationsData = await getCommunications(state.token);
        setAllCommunications(allCommunicationsData);
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
                        alert('This feature is in progress, and coming soon.  It will allow email and text from here!');
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
        </VStack>
    );
}
