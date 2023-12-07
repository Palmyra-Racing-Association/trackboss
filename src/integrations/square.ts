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
        environment: Environment.Sandbox, // Change this to Environment.Production for live transactions
        accessToken,
    });

    try {
        const start = Date.now();
        const response = await client.checkoutApi.createPaymentLink({
            idempotencyKey: v4(),
            order: {
                customerId: memberBill.membershipId.toString(),
                locationId,
                referenceId: memberBill.billId.toString(),
                lineItems: [
                    {
                        name: `Palmyra Racing Assocation - dues for ${memberBill.year}`,
                        quantity: '1',
                        note: memberBill.membershipAdmin,
                        basePriceMoney: {
                            amount: BigInt(memberBill.amountWithFee * 100),
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
        logger.error(error);
        throw (error);
    }
}
