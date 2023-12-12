import React, { useContext, useState } from 'react';
import {
    Box,
    Button, Divider, Heading, Modal, ModalContent, ModalFooter, ModalOverlay,
} from '@chakra-ui/react';
import { Bill } from '../../../../src/typedefs/bill';
import { UserContext } from '../../contexts/UserContext';

import { attestInsurance } from '../../controller/billing';
import WrappedSwitchInput from '../input/WrappedSwitchInput';
import BillingStatsDisplay from '../shared/BillingStatsDisplay';

interface duesModalProps {
    isOpen: boolean,
    // eslint-disable-next-line react/no-unused-prop-types
    token: string,
    // eslint-disable-next-line react/require-default-props
    viewBill?: Bill;
    insuranceAttested: boolean,
    onClose: () => void,
    payOnlineAction: () => void,
    paySnailMailAction: () => void,
}

export default function DuesAndWaiversModal(props: duesModalProps) {
    const { state } = useContext(UserContext);

    const billingYear = props.viewBill?.year || new Date().getFullYear();

    const [insuranceAttested, setInsuranceAttested] = useState<boolean>(props.viewBill?.curYearIns || false);

    const attested = (props.insuranceAttested || insuranceAttested);

    const currentTime = new Date().getTime();

    // months are zero based, so January is 0, November is 10, December is 11, and there is no 12. I can never remember
    // this fun fact and always mess it up, so making this note here next time I need this.
    const startOfBillingPeriod = new Date(billingYear, 10, 21).getTime();

    let renewalPaymentComponent = (
        <>
            <Box>
                {`Renewal and payment options are available on or after December 1st, ${billingYear}.`}
            </Box>
            <Box>
                <Button
                    variant="outline"
                    size="lg"
                    bgColor="orange.300"
                    color="white"
                    onClick={
                        () => {
                            props.onClose();
                        }
                    }
                >
                    Close
                </Button>
            </Box>
        </>
    );
    if (currentTime >= startOfBillingPeriod) {
        renewalPaymentComponent = (
            <>
                <Button
                    variant="outline"
                    mr={3}
                    size="lg"
                    color="white"
                    bgColor={attested ? 'green' : 'red'}
                    onClick={
                        async () => {
                            props.onClose();
                        }
                    }
                >
                    {attested ? 'All set!' : 'I\'m not ready'}
                </Button>
                <Button
                    backgroundColor="orange.300"
                    color="white"
                    variant="outline"
                    size="lg"
                    hidden={!attested || (props.viewBill?.amount === 0) || (props.viewBill?.curYearPaid)}
                    onClick={
                        async () => {
                            props.payOnlineAction();
                        }
                    }
                >
                    Pay With Square
                </Button>
                <Button
                    ml={2}
                    backgroundColor="orange.300"
                    color="white"
                    variant="outline"
                    size="lg"
                    hidden={!attested || (props.viewBill?.amount === 0) || (props.viewBill?.curYearPaid)}
                    onClick={
                        async () => {
                            props.paySnailMailAction();
                        }
                    }
                >
                    Pay with cash/check
                </Button>
            </>
        );
    }

    return (
        <Modal isCentered size="lg" isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <Heading m={3}>
                    {`${billingYear + 1} PRA bill and attestation`}
                </Heading>
                <Box m={3}>
                    <Box mb={2}>
                        Your dues are listed below.  You can pay via mail, in person, or via the Paypal button.
                        If your dues are $0 no payment options are presented as we just need attestation of insurance.
                    </Box>
                    <BillingStatsDisplay bill={props.viewBill} />
                    <Box mb={1}>
                        By clicking this box, I attest that I have, and will maintain, valid health insurance for the
                        {` ${billingYear + 1} season.  I agree to notify PRA of any change in my insurance status.`}
                        <p />
                        I also agree to the PRA sound rule and code of conduct found at
                        &nbsp;
                        <a target="_blank" href="https://palmyramx.com" rel="noreferrer">palmyramx.com</a>
                        .
                    </Box>
                    <WrappedSwitchInput
                        wrapperText="(Payment options appear after you agree to this if applicable)"
                        defaultChecked={attested}
                        onSwitchChange={
                            async () => {
                                setInsuranceAttested(true);
                                await attestInsurance(state.token, props.viewBill?.billId || 0);
                            }
                        }
                        maxWidth={400}
                        locked={attested}
                        toastMessage="Insurance attestation has been recorded and will be emailed to you."
                    />
                </Box>

                <Divider />
                <ModalFooter>
                    {renewalPaymentComponent}
                </ModalFooter>
            </ModalContent>

        </Modal>
    );
}
