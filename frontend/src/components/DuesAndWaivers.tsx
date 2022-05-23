import { Heading, HStack, Text, VStack } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Bill } from '../../../src/typedefs/bill';
import { UserContext } from '../contexts/UserContext';
import { getBillsForMembership } from '../controller/billing';

export default function DuesAndWaivers() {
    const { state } = useContext(UserContext);
    const [allBills, setAllBills] = useState<Bill[]>();
    useEffect(() => {
        async function getData() {
            const membershipId = state.user?.membershipId || -1;
            const memberBills = await getBillsForMembership(state.token, membershipId);
            setAllBills(memberBills as Bill[]);
        }
        getData();
    }, []);

    const columns: any = [
        {
            name: 'Due Date',
            selector: (row: Bill) => `${row.dueDate}`,
        },
        {
            name: 'Billing Year',
            selector: (row: Bill) => row.year,
            sortable: true,
            maxWidth: '25',
        },
        {
            name: 'Amount',
            selector: (row: Bill) => `$${row.amount} ($${row.amountWithFee})`,
            sortable: true,
            maxWidth: '25',
        },
        {
            name: 'Generated on',
            selector: (row: Bill) => `${row.generatedDate}`,
            sortable: true,
        },
    ];
    return (
        <VStack mt={25}>
            <HStack>
                <Heading>Dues and Waivers</Heading>
            </HStack>
            <Text align="left">
                Your dues for 2023 and beyond are displayed below.  Note that payment links will be available on or
                around January 1.  Until then, you can see your projected amount based on the work you have completed
                so far.  This will change as you earn more points.  Billing is updated daily.
            </Text>
            <DataTable
                columns={columns}
                data={allBills as Bill[]}
                customStyles={
                    {
                        headCells: {
                            style: {
                                paddingTop: '0',
                                fontSize: '1.5em',
                                backgroundColor: '#f9f9f9',
                                color: '#626262',
                            },
                        },
                        cells: {
                            style: {
                                fontSize: '1.2em',
                            },
                        },
                    }
                }
                fixedHeaderScrollHeight="300px"
                highlightOnHover
                responsive
                subHeaderWrap
            />
        </VStack>
    );
}
