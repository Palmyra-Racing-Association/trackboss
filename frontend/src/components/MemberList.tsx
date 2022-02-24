/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-prop-types */
import { useDisclosure } from '@chakra-ui/react';
import React, { createRef, RefObject, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Bike } from '../../../src/typedefs/bike';
import { Member } from '../../../src/typedefs/member';
import { getFormattedMemberList } from '../controller/member';
import MemberSummaryModal from './MemberSummaryModal';

function getMemberFamilyLocal() {
    // const response = getMembersByMembership()
    const memberFamily: Member[] = [
        {
            memberId: 1,
            membershipAdmin: 'true',
            active: true,
            memberType: 'member',
            firstName: 'test',
            lastName: 'member',
            phoneNumber: '1234',
            email: 'user@example.com',
            uuid: '',
            occupation: '',
            birthdate: '',
            dateJoined: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            lastModifiedDate: '',
            lastModifiedBy: '',
        },
        {
            memberId: 2,
            membershipAdmin: 'string',
            active: true,
            memberType: 'member',
            firstName: 'Jon',
            lastName: 'Smith',
            phoneNumber: '1234',
            email: 'user@example.com',
            uuid: '',
            occupation: '',
            birthdate: '',
            dateJoined: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            lastModifiedDate: '',
            lastModifiedBy: '',
        },
    ];
    return memberFamily;
}

function getMemberBikesLocal() {
    // const response = getBikes()
    const memberBikes: Bike[] = [
        {
            bikeId: 0,
            year: '2012',
            make: 'honda',
            model: 'rust-bucket',
            membershipAdmin: 'string',
        },
    ];
    return memberBikes;
}

const columns: any = [
    {
        name: 'Name',
        selector: (row: Member) => `${row.firstName} ${row.lastName}`,
    },
    {
        name: 'Role',
        selector: (row: Member) => row.memberType,
    },
];

function getFormattedMemberListLocal() {
    const response = getFormattedMemberList('TestToken');
    return response;
}

const customStyles = {
    rows: {
        style: {
            minHeight: '65px',
        },
    },
    headCells: {
        style: {
            marginTop: '90px',
            paddingTop: '0',
            fontSize: '3em',
            backgroundColor: '#f9f9f9',
            color: '#626262',
        },
    },
    cells: {
        style: {
            fontSize: '2.0em',
        },
    },
};

function MemberList() {
    const testRef = createRef<HTMLDivElement>();

    const { onClose, isOpen, onOpen } = useDisclosure();
    const [selectedMember, setSelectedMember] = useState<Member>();
    const [cells, setCells] = useState<Member[]>([]);
    useEffect(() => {
        async function getData() {
            const c: Member[] = getFormattedMemberListLocal();
            setCells(c);
        }
        getData();
    }, []);
    return (
        <div data-testid="table" ref={testRef}>
            <DataTable
                columns={columns}
                data={cells}
                fixedHeaderScrollHeight="300px"
                highlightOnHover
                pagination
                responsive
                subHeaderWrap
                customStyles={customStyles}
                onRowClicked={
                    async (row: Member) => {
                        await setSelectedMember(row);
                        onOpen();
                    }
                }
            />
            {
                selectedMember && (
                    <MemberSummaryModal
                        isOpen={isOpen}
                        onClose={onClose}
                        memberInfo={selectedMember}
                        memberFamily={getMemberFamilyLocal()}
                        memberBikes={getMemberBikesLocal()}
                    />
                )
            }
        </div>
    );
}

// eslint-disable-next-line max-len
// const FunctionalComponentToPrint = React.forwardRef<HTMLDivElement, {}>((props, ref) => <MemberList ref={ref} />);
interface fakeProps {}

const FunctionalComponentToPrint = React.forwardRef<HTMLDivElement, fakeProps>(
    (props, ref) => (
        <div ref={ref}>
            <MemberList />
        </div>
    ),
);

export default FunctionalComponentToPrint;
