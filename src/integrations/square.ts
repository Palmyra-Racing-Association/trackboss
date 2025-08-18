import { v4 } from 'uuid';
import { Client, Environment, Location } from 'square';
import { Bill } from '../typedefs/bill';
import logger from '../logger';
import { getSquareObject } from '../util/environmentWrapper';

export async function createPaymentLink(memberBill: Bill) {
    const squareAccess = await getSquareObject();
    const { locationId, token } = squareAccess;

    // Set Square credentials and environment
    const client = new Client({
        environment: Environment.Production, // Change this to Environment.Production for live transactions
        accessToken: token,
    });

    try {
        const start = Date.now();
        // Square uses cents for payment so we convert here.  and force two decimal places becuase the
        // calculation gets jacked up otherwise.
        const paymentAmount = (memberBill.amountWithFee * 100).toFixed(0);

        const response = await client.checkoutApi.createPaymentLink({
            idempotencyKey: v4(),
            order: {
                locationId,
                referenceId: memberBill.billId.toString(),
                lineItems: [
                    {
                        // eslint-disable-next-line max-len
                        name: `Palmyra Racing Association - ${memberBill.membershipAdmin} dues for ${memberBill.year + 1} season`,
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
                buyerEmail: memberBill.membershipAdminEmail,
                buyerPhoneNumber: memberBill.phone,
                // Names don’t go in buyerAddress anymore — Square may ignore or reject
                // You could use "buyerNote" if you want to carry forward the name
            },
        });

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

export async function getLocations() {
    const squareAccess = await getSquareObject();
    const { token } = squareAccess;

    // Set Square credentials and environment
    const client = new Client({
        environment: Environment.Production, // Change this to Environment.Production for live transactions
        accessToken: token,
    });
    let squareLocations : Location[] = [];
    try {
        squareLocations = (await client.locationsApi.listLocations()).result.locations || [];
    } catch (error) {
        logger.error('Error accessing Square', error);
    }
    return squareLocations;
}
