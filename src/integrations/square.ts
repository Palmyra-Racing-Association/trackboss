import { v4 } from 'uuid';
import { Client, Environment } from 'square';
import { Bill } from '../typedefs/bill';
import logger from '../logger';

// eslint-disable-next-line import/prefer-default-export
export async function createPaymentLink(memberBill: Bill) {
    const accessToken = process.env.SQUARE_TOKEN;
    const locationId = process.env.SQUARE_LOCATION || '';

    // Set Square credentials and environment
    const client = new Client({
        environment: Environment.Production, // Change this to Environment.Production for live transactions
        accessToken,
    });

    try {
        const start = Date.now();
        // Square uses cents for payment so we convert here.  and force two decimal places becuase the
        // calculation gets jacked up otherwise.
        const paymentAmount = (memberBill.amountWithFee * 100).toFixed(0);
        const response = await client.checkoutApi.createPaymentLink({
            idempotencyKey: v4(),
            order: {
                customerId: memberBill.membershipId.toString(),
                locationId,
                referenceId: memberBill.billId.toString(),
                lineItems: [
                    {
                        name: `Palmyra Racing Association - ${memberBill.membershipAdmin} dues for ${memberBill.year}`,
                        quantity: '1',
                        note: memberBill.membershipAdmin,
                        basePriceMoney: {
                            amount: BigInt(paymentAmount),
                            currency: 'USD',
                        },
                    },
                ],
            },
            checkoutOptions: {
                allowTipping: false,
                merchantSupportEmail: 'hogbacksecretary@gmail.com',
                acceptedPaymentMethods: {
                    googlePay: true,
                    applePay: true,
                    afterpayClearpay: true,
                },
            },
            prePopulatedData: {
                buyerAddress: {
                    lastName: memberBill.lastName,
                    firstName: memberBill.firstName,
                },
                buyerEmail: memberBill.membershipAdminEmail,
                buyerPhoneNumber: memberBill.phone,
            },
        });
        console.log(Date.now() - start);
        console.log(response.result);
        console.log(response?.result?.paymentLink?.url);
        return {
            squareUrl: response?.result?.paymentLink?.url,
            squareOrderId: response?.result?.paymentLink?.orderId,
        };
    } catch (error) {
        logger.error(JSON.stringify(memberBill));
        logger.error(error);
        throw (error);
    }
}
