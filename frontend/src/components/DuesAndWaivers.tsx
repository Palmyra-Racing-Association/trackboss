import { Heading, HStack, VStack } from '@chakra-ui/react';
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
    /*
    {
        "billId":3362,
        "generatedDate":"2022-05-23",
        "year":2022,
        "amount":428.57,
        "amountWithFee":441.3,
        "membershipAdmin":"Alan Delimon",
        "membershipAdminEmail":"adelimon@gmail.com",
        "emailedBill":null,
        "curYearPaid":false
     }
     */
    const columns: any = [
        {
            name: 'Bill Year',
            selector: (row: Bill) => row.year,
            sortable: true,
        },
        {
            name: 'Amount',
            selector: (row: Bill) => `$${row.amount} ($${row.amountWithFee} w/ PayPal)`,
            sortable: true,
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
