import {
    Alert,
    Button,
    Heading, HStack, Link, Modal, ModalContent, ModalOverlay, Stat, StatGroup, StatHelpText, StatLabel,
    StatNumber, Text, useDisclosure, VStack,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Bill } from '../../../../src/typedefs/bill';
import { UserContext } from '../../contexts/UserContext';

import { attestInsurance, getBills, payBill } from '../../controller/billing';
import DataSearchBox from '../input/DataSearchBox';
import WrappedSwitchInput from '../input/WrappedSwitchInput';
import BillingStatsDisplay from './BillingStatsDisplay';

export default function DuesAndWaiversList() {
    const { state } = useContext(UserContext);
    const [allBillsData, setAllBillsData] = useState<Bill[]>([]);
    const [filteredBills, setFilteredBills] = useState<Bill[]>([]);
    const [markedPaid, setMarkedPaid] = useState<number>(0);
    const [markedAttested, setMarkedAttested] = useState<number>(0);
    const [owesZero, setOwesZero] = useState<number>(0);
    const [selectedBill, setSelectedBill] = useState<Bill>();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterNoPayment, setFilterNoPayment] = useState<boolean>(false);
    const [filterPaperwork, setFilterPaperwork] = useState<boolean>(false);
    const [filterPaid, setFilterPaid] = useState<boolean>(false);

    const { isOpen, onClose, onOpen } = useDisclosure();

    async function getMembershipBillData() {
        const memberBills = await getBills(state.token) as Bill[];
        let attested = 0;
        let paid = 0;
        let owesNothing = 0;
        memberBills.forEach((bill) => {
            if (bill.curYearIns) attested++;
            if (bill.curYearPaid) paid++;
            if (bill.amount === 0) owesNothing++;
        });
        setAllBillsData(memberBills as Bill[]);
        setFilteredBills(memberBills as Bill[]);
        setMarkedPaid(paid);
        setMarkedAttested(attested);
        setOwesZero(owesNothing);
    }

    async function runFilters() {
        if (filterNoPayment) {
            const zeroDollarBills = filteredBills.filter((bill) => (bill.amount > 0));
            setFilteredBills(zeroDollarBills);
        }
        if (filterPaperwork) {
            const paperworkBills = filteredBills.filter((bill) => (!bill.curYearIns));
            setFilteredBills(paperworkBills);
        }
        if (filterPaid) {
            const paidBills = filteredBills.filter((bill) => (!bill.curYearPaid));
            setFilteredBills(paidBills);
        }
        if (searchTerm) {
            const nameBills = filteredBills.filter((bill) => {
                const firstNameFound = (bill.firstName.toLowerCase().includes(searchTerm));
                const lastNameFound = (bill.lastName.toLowerCase().includes(searchTerm));
                return firstNameFound || lastNameFound;
            });
            setFilteredBills(nameBills);
        }
        // if no filters, set data to all data
        if ((searchTerm === '') && !filterNoPayment && !filterPaperwork && !filterPaid) {
            setFilteredBills(allBillsData);
        }
    }

    useEffect(() => {
        getMembershipBillData();
    }, []);

    useEffect(() => {
        runFilters();
    }, [searchTerm, filterNoPayment, filterPaid, filterPaperwork]);

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
            name: 'Type',
            selector: (row: Bill) => row.membershipType,
            sortable: true,
        },
        {
            name: 'Insurance Validated',
            selector: (row: Bill) => (row.curYearIns ? 'Yes' : 'No'),
            sortable: true,
            maxWidth: '5',
        },
        {
            name: 'Bill paid',
            selector: (row:Bill) => (row.curYearPaid ? 'Yes' : 'No'),
            sortable: true,
            maxWidth: '5',
        },
    ];

    return (
        <VStack mt={25}>
            <StatGroup>
                <Stat>
                    <StatLabel>Paid or Owes $0</StatLabel>
                    <StatNumber>{markedPaid}</StatNumber>
                    <StatHelpText>{`${owesZero} owe $0`}</StatHelpText>
                </Stat>
                <Stat>
                    <StatLabel>Rules and Insurance</StatLabel>
                    <StatNumber>{markedAttested}</StatNumber>
                    <StatHelpText>{`Of ${allBillsData.length}`}</StatHelpText>
                </Stat>
            </StatGroup>
            <DataSearchBox
                onTextChange={setSearchTerm}
                searchValue={searchTerm}
            />
            <HStack>
                <WrappedSwitchInput
                    defaultChecked={false}
                    maxWidth={300}
                    wrapperText="Hide members paying $0"
                    onSwitchChange={
                        () => {
                            setFilterNoPayment(!filterNoPayment);
                        }
                    }
                />
                <WrappedSwitchInput
                    defaultChecked={false}
                    maxWidth={300}
                    wrapperText="Hide members with completed paperwork"
                    onSwitchChange={
                        () => {
                            setFilterPaperwork(!filterPaperwork);
                        }
                    }
                />
                <WrappedSwitchInput
                    defaultChecked={false}
                    maxWidth={300}
                    wrapperText="Hide members that have paid"
                    onSwitchChange={
                        () => {
                            setFilterPaid(!filterPaid);
                        }
                    }
                />
            </HStack>
            <DataTable
                columns={columns}
                data={filteredBills as Bill[]}
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
                pagination
                paginationPerPage={50}
                paginationRowsPerPageOptions={[50, (allBillsData?.length || 999)]}
                responsive
                striped
                subHeaderWrap
                defaultSortFieldId={1}
            />
            <Modal isCentered size="lg" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent padding={3}>
                    <Heading>
                        {`Billing detail for ${selectedBill?.membershipAdmin} - ${selectedBill?.year}`}
                    </Heading>
                    <BillingStatsDisplay bill={selectedBill} />
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
                        toastMessage={`${selectedBill?.firstName} ${selectedBill?.lastName} marked as paid.`}
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
                        locked={selectedBill?.curYearIns}
                        toastMessage={`${selectedBill?.firstName} ${selectedBill?.lastName} paperwork complete.`}
                        maxWidth={400}
                    />
                    <Text
                        fontSize="sm"
                    >
                        Once insurance is attested, this checkbox locks so contact support if you need to undo it.
                    </Text>
                    <Alert status="warning">
                        <Link fontSize="sm" href={`sms:${selectedBill?.phone}`} isExternal>
                            {`Text at ${selectedBill?.phone}`}
                        </Link>
                        <Link fontSize="sm" href={`mailto:${selectedBill?.membershipAdminEmail}`} isExternal>
                            {`Email at ${selectedBill?.membershipAdminEmail}`}
                        </Link>
                        <Link fontSize="sm" href={`tel:${selectedBill?.phone}`} isExternal>
                            {`Call at ${selectedBill?.phone}`}
                        </Link>
                    </Alert>
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
