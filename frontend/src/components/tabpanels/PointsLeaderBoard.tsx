import {
    Center,
    HStack,
    VStack,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Bill } from '../../../../src/typedefs/bill';
import { UserContext } from '../../contexts/UserContext';

import {
    getBills,
} from '../../controller/billing';
import DataSearchBox from '../input/DataSearchBox';
import dataTableStyles from '../shared/DataTableStyles';
import getYearsForBillingDisplay from '../../util/billing';
import YearsDropDown from '../shared/YearsDropDown';

export default function PointsLeaderboard() {
    const { state } = useContext(UserContext);
    const [allBillsData, setAllBillsData] = useState<Bill[]>([]);
    const [filteredBills, setFilteredBills] = useState<Bill[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [applicationYear, setApplicationYear] = useState<number>(new Date().getFullYear());
    const [yearsList, setYearsList] = useState<number[]>([]);
    const [initialYear, setInitialYear] = useState<number>(new Date().getFullYear());

    async function getMembershipBillData() {
        let memberBills : Bill[] = [];
        try {
            memberBills = await getBills(state.token, applicationYear) as Bill[];
        } catch (error) {
            // console.log(error);
        }
        memberBills = memberBills.sort((billA, billB) => billB.pointsEarned - billA.pointsEarned);
        memberBills = memberBills.slice(0, 20);
        setAllBillsData(memberBills as Bill[]);
        setFilteredBills(memberBills as Bill[]);
    }

    useEffect(() => {
        getMembershipBillData();
        getYearsForBillingDisplay(setInitialYear, setYearsList);
    }, [applicationYear]);

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredBills(allBillsData);
        } else {
            const nameBills = allBillsData.filter((bill:Bill) => {
                const firstNameFound = (bill.firstName.toLowerCase().includes(searchTerm));
                const lastNameFound = (bill.lastName.toLowerCase().includes(searchTerm));
                return (firstNameFound || lastNameFound);
            });
            setFilteredBills(nameBills);
        }
    }, [searchTerm]);

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
            name: 'Type',
            selector: (row: Bill) => row.membershipType,
            sortable: true,
            hide: 'sm',
        },
    ];

    return (
        <VStack mt={25}>
            <Center>
                <YearsDropDown
                    years={yearsList}
                    initialYear={initialYear}
                    header="PRA Points leaders"
                    setYear={setApplicationYear}
                />
            </Center>
            <HStack>
                <DataSearchBox
                    onTextChange={setSearchTerm}
                    searchValue={searchTerm}
                />
            </HStack>
            <DataTable
                columns={columns}
                data={filteredBills as Bill[]}
                customStyles={dataTableStyles()}
                fixedHeaderScrollHeight="300px"
                highlightOnHover
                pagination
                paginationPerPage={50}
                paginationRowsPerPageOptions={[50, (allBillsData?.length || 999)]}
                responsive
                striped
                subHeaderWrap
            />
        </VStack>
    );
}
