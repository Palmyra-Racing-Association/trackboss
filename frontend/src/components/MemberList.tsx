import { useDisclosure } from '@chakra-ui/react';
import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ErrorResponse } from '../../../src/typedefs/errorResponse';
import { Member } from '../../../src/typedefs/member';
import { UserContext } from '../contexts/UserContext';
import { getAllBoardMembersForCurrentYear } from '../controller/boardMember';
import { getMemberList } from '../controller/member';
import MemberSummaryModal from './MemberSummaryModal';

const columns: any = [
    {
        name: 'Last Name',
        selector: (row: Member) => row.lastName,
        sortable: true,
    },
    {
        name: 'First Name',
        selector: (row: Member) => row.firstName,
        sortable: true,
    },
    {
        name: 'Membership Type',
        selector: (row: Member) => row.membershipType,
        sortable: true,
    },
    {
        name: 'Role',
        selector: (row: Member) => row.memberType,
        sortable: true,
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
};

export default function MemberList() {
    const [selectedMember, setSelectedMember] = useState<Member>();
    const [cells, setCells] = useState<Member[]>([]);
    const { state } = useContext(UserContext);
    const [error, setError] = useState<ErrorResponse | undefined>(undefined);
    const [dirty, setDirty] = useState<boolean>(false);
    const { onClose, isOpen, onOpen } = useDisclosure({ onClose: () => setDirty((oldDirty) => !oldDirty) });

    useEffect(() => {
        async function getData() {
            const c: Member[] | ErrorResponse = await getMemberList(state.token);
            const boardMembers = await getAllBoardMembersForCurrentYear(state.token);
            if ('reason' in c) {
                setError(c);
            } else {
                if ('reason' in boardMembers) {
                    // do nothing, an error here isn't a big deal, it just means we can't show baord member data
                } else {
                    _.forEach(boardMembers, (boardMember) => {
                        _.forEach(c, (member: Member) => {
                            if (member.memberId === boardMember.memberId) {
                                member.memberType = `Board Member - ${boardMember.title}`;
                                member.boardMemberData = boardMember;
                                return false;
                            }
                            return true;
                        });
                    });
                }
                setCells(_.filter(c, (member) => member.active));
                setError(undefined);
            }
        }
        getData();
    }, [dirty]);
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
                defaultSortFieldId={1}
                customStyles={customStyles}
                paginationComponentOptions={
                    {
                        selectAllRowsItem: true,
                    }
                }
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
