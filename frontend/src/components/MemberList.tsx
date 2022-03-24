import { useDisclosure } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ErrorResponse } from '../../../src/typedefs/errorResponse';
import { Member } from '../../../src/typedefs/member';
import { UserContext } from '../contexts/UserContext';
import { getMemberList } from '../controller/member';
import MemberSummaryModal from './MemberSummaryModal';

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

export default function MemberList() {
    const { onClose, isOpen, onOpen } = useDisclosure();
    const [selectedMember, setSelectedMember] = useState<Member>();
    const [cells, setCells] = useState<Member[]>([]);
    const userContext = useContext(UserContext);
    const [error, setError] = useState<ErrorResponse | undefined>(undefined);
    useEffect(() => {
        async function getData() {
            const c: Member[] | ErrorResponse = await getMemberList(userContext.state.token);
            if ('reason' in c) {
                setError(c);
            } else {
                setCells(c);
                setError(undefined);
            }
        }
        getData();
    }, []);
    if (error) {
        return (
            <div>
                {error.reason}
            </div>
        );
    }
    return (
        <div>
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
                    (row: Member) => {
                        setSelectedMember(row);
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
                    />
                )
            }
        </div>
    );
}
