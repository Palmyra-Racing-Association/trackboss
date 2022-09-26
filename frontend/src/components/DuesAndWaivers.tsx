import { Heading, HStack, Text, useDisclosure, VStack } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Bill } from '../../../src/typedefs/bill';
import { UserContext } from '../contexts/UserContext';
import { attestInsurance, getBillsForMembership } from '../controller/billing';
import DuesAndWaiversModal from './modals/DuesAndWaiversModal';

export default function DuesAndWaivers() {
    const { state } = useContext(UserContext);
    const [allBills, setAllBills] = useState<Bill[]>();
    const [selectedBill, setSelectedBill] = useState<Bill>();
    const { isOpen, onClose, onOpen } = useDisclosure();

    async function getMembershipBillData() {
        const membershipId = state.user?.membershipId || -1;
        const memberBills = await getBillsForMembership(state.token, membershipId);
        setAllBills(memberBills as Bill[]);
    }

    useEffect(() => {
        getMembershipBillData();
    }, []);

    const columns: any = [
        {
            name: 'Due Date',
            selector: (row: Bill) => `${row.dueDate}`,
            wrap: true,
        },
        {
            name: 'Billing Year',
            selector: (row: Bill) => row.year,
            sortable: true,
            maxWidth: '25',
            hide: 'sm',
        },
        {
            name: 'Points Earned',
            selector: (row: Bill) => row.pointsEarned,
            sortable: true,
            maxWidth: '25',
        },
        {
            name: 'Points required',
            selector: (row:Bill) => row.pointsThreshold,
            sortable: true,
            maxWidth: '25',
            hide: 'sm',
        },
        {
            name: 'Amount',
            selector: (row: Bill) => `$${row.amount} ($${row.amountWithFee})`,
            sortable: true,
            maxWidth: '25',
        },
        {
            name: 'Insurance Validated',
            selector: (row: Bill) => `${row.curYearIns}`,
            maxWidth: '10',
        },
        {
            name: 'Generated on',
            selector: (row: Bill) => `${row.generatedDate}`,
            sortable: true,
            hide: 'sm',
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
                onRowClicked={
                    (row: Bill) => {
                        setSelectedBill(row);
                        onOpen();
                    }
                }
                fixedHeaderScrollHeight="300px"
                highlightOnHover
                responsive
                subHeaderWrap
            />
            (selectedBill &&
            <DuesAndWaiversModal
                viewBill={selectedBill}
                token={state.token}
                insuranceAttested={selectedBill?.curYearIns || false}
                isOpen={isOpen}
                onClose={onClose}
                attestationAction={
                    () => {
                        if (selectedBill?.billId) {
                            attestInsurance(state.token, selectedBill?.billId);
                            // after attesting, reload the list.
                            getMembershipBillData();
                        }
                    }
                }
                payOnlineAction={
                    () => {
                        window.open(`https://paypal.me/palmyraracing/${selectedBill?.amount}`);
                    }
                }
                paySnailMailAction={
                    () => {
                        // eslint-disable-next-line max-len
                        window.open(`mailto:hogbacksecretary@gmail.com?subject=Dues%20Payment%20for%20${selectedBill?.firstName}%20${selectedBill?.lastName}&body=I%20intend%20to%20pay%20my%202023%20dues%20via%20%3CYour%20method%20here%3E%20by%20${selectedBill?.dueDate}`);
                    }
                }
            />
            );
        </VStack>
    );
}
