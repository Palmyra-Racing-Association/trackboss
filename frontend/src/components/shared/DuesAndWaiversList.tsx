import {
    Button,
    Heading, Modal, ModalContent, ModalOverlay, Stat, StatHelpText,
    StatLabel, StatNumber, useDisclosure, VStack,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Bill } from '../../../../src/typedefs/bill';
import { UserContext } from '../../contexts/UserContext';

import { attestInsurance, getBills, payBill } from '../../controller/billing';
import WrappedSwitchInput from '../input/WrappedSwitchInput';

export default function DuesAndWaiversList() {
    const { state } = useContext(UserContext);
    const [allBills, setAllBills] = useState<Bill[]>();
    const [selectedBill, setSelectedBill] = useState<Bill>();
    const { isOpen, onClose, onOpen } = useDisclosure();

    async function getMembershipBillData() {
        const memberBills = await getBills(state.token);
        setAllBills(memberBills as Bill[]);
    }

    useEffect(() => {
        getMembershipBillData();
    }, []);

    const columns: any = [
        {
            name: 'Last Name',
            selector: (row: Bill) => row.lastName,
            sortable: true,
            maxWidth: '10',
        },
        {
            name: 'First Name',
            selector: (row: Bill) => row.firstName,
            sortable: true,
            maxWidth: '10',
        },
        {
            name: 'Points Earned',
            selector: (row: Bill) => row.pointsEarned,
            sortable: true,
            maxWidth: '10',
            hide: 'sm',
        },
        {
            name: 'Amount',
            selector: (row: Bill) => `$${row.amount} ($${row.amountWithFee})`,
            sortable: true,
            maxWidth: '5',
        },
        {
            name: 'Insurance Validated',
            selector: (row: Bill) => `${row.curYearIns}`,
            sortable: true,
            maxWidth: '5',
        },
        {
            name: 'Bill paid',
            selector: (row:Bill) => `${row.curYearPaid}`,
            sortable: true,
            maxWidth: '5',
        },
    ];

    return (
        <VStack mt={25}>
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
            <Modal isCentered size="lg" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent padding={3}>
                    <Heading>
                        {`Billing detail for ${selectedBill?.membershipAdmin} - ${selectedBill?.year}`}
                    </Heading>
                    <Stat>
                        <StatLabel>
                            Points Earned in &nbsp;
                            {selectedBill?.year}
                        </StatLabel>
                        <StatNumber>
                            {selectedBill?.pointsEarned}
                            &nbsp;
                        </StatNumber>
                        <StatHelpText>
                            of
                            &nbsp;
                            {selectedBill?.pointsThreshold}
                        </StatHelpText>
                    </Stat>
                    <Stat>
                        <StatLabel>
                            Amount Due
                        </StatLabel>
                        <StatNumber>
                            {`$${selectedBill?.amount}`}
                        </StatNumber>
                        <StatHelpText>
                            {`$${selectedBill?.amountWithFee} w/ PayPal`}
                        </StatHelpText>
                    </Stat>
                    <WrappedSwitchInput
                        wrapperText="Mark (or unmark) as paid"
                        defaultChecked={selectedBill?.curYearPaid || false}
                        onSwitchChange={
                            async () => {
                                if (selectedBill?.billId) {
                                    await payBill(state.token, selectedBill?.billId);
                                    getMembershipBillData();
                                }
                            }
                        }
                        maxWidth={400}
                    />
                    <WrappedSwitchInput
                        wrapperText="Mark (or unmark) as insurance submitted"
                        defaultChecked={selectedBill?.curYearIns || false}
                        onSwitchChange={
                            async () => {
                                if (selectedBill?.billId) {
                                    await attestInsurance(state.token, selectedBill?.billId);
                                    getMembershipBillData();
                                }
                            }
                        }
                        maxWidth={400}
                    />
                    <Button
                        mt={10}
                        variant="outline"
                        size="lg"
                        bgColor="orange.300"
                        width={150}
                        color="white"
                        onClick={
                            () => {
                                onClose();
                            }
                        }
                    >
                        Close
                    </Button>
                </ModalContent>
            </Modal>
        </VStack>
    );
}
