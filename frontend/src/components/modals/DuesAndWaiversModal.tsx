import React, { useState } from 'react';
import {
    Box,
    Button, Divider, Heading, Modal, ModalContent, ModalFooter, ModalOverlay,
    Stat, StatHelpText, StatLabel, StatNumber,
} from '@chakra-ui/react';
import { Bill } from '../../../../src/typedefs/bill';
import WrappedSwitchInput from '../input/WrappedSwitchInput';

interface duesModalProps {
    isOpen: boolean,
    // eslint-disable-next-line react/no-unused-prop-types
    token: string,
    // eslint-disable-next-line react/require-default-props
    viewBill?: Bill;
    onClose: () => void,
    payOnlineAction: () => void,
    paySnailMailAction: () => void,
}

export default function DuesAndWaiversModal(props: duesModalProps) {
    const billingYear = props.viewBill?.year || 0;

    const [insuranceAttested, setInsuranceAttested] = useState<boolean>(false);

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
                    </Box>
                    <Stat>
                        <StatLabel>
                            Points Earned in &nbsp;
                            {props.viewBill?.year}
                        </StatLabel>
                        <StatNumber>
                            {props.viewBill?.pointsEarned}
                            &nbsp;
                        </StatNumber>
                        <StatHelpText>
                            of
                            &nbsp;
                            {props.viewBill?.pointsThreshold}
                        </StatHelpText>
                    </Stat>
                    <Stat>
                        <StatLabel>
                            Amount Due
                        </StatLabel>
                        <StatNumber>
                            {`$${props.viewBill?.amount}`}
                        </StatNumber>
                        <StatHelpText>
                            {`$${props.viewBill?.amountWithFee} w/ PayPal`}
                        </StatHelpText>
                    </Stat>
                    <Box mb={1}>
                        By clicking this box, I attest that I have, and will maintain, valid health insurance for the
                        {` ${billingYear + 1} season.  I further agree that failure to maintain such valid `}
                        health insurance can lead to suspension or revocation of my membership. I agree to notify
                        PRA of any change in my insurance status.
                    </Box>
                    <WrappedSwitchInput
                        wrapperText="(Payment options appear after you agree to this if applicable)"
                        defaultChecked={insuranceAttested}
                        onSwitchChange={setInsuranceAttested}
                        maxWidth={400}
                    />
                </Box>

                <Divider />
                <ModalFooter>
                    <Button
                        variant="ghost"
                        mr={3}
                        size="lg"
                        onClick={
                            () => {
                                props.onClose();
                            }
                        }
                    >
                        {insuranceAttested ? 'Close' : 'Close without agreeing'}
                    </Button>
                    <Button
                        backgroundColor="orange.300"
                        color="white"
                        variant="ghost"
                        size="lg"
                        hidden={!insuranceAttested}
                        onClick={
                            async () => {
                                props.payOnlineAction();
                            }
                        }
                    >
                        Pay With Paypal
                    </Button>
                    <Button
                        ml={2}
                        backgroundColor="orange.300"
                        color="white"
                        variant="ghost"
                        size="lg"
                        hidden={!insuranceAttested}
                        onClick={
                            async () => {
                                props.paySnailMailAction();
                            }
                        }
                    >
                        Pay another way
                    </Button>
                </ModalFooter>
            </ModalContent>

        </Modal>
    );
}
