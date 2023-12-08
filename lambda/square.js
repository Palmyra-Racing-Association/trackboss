const { v4 } = require('uuid');
const { Client, Environment } = require('square');

const createLink = async () => {
    const accessToken = process.env.SQUARE_TOKEN;
    const locationId = process.env.SQUARE_LOCATION;

    // Set Square credentials and environment
    const client = new Client({
        environment: Environment.Production, // Change this to Environment.Production for live transactions
        accessToken: accessToken,
    });

    try {
        const start = Date.now();
        const response = await client.checkoutApi.createPaymentLink({
            idempotencyKey: v4(),
            order: {
                customerId: '69420',
                locationId: locationId,
                referenceId: '834934',
                lineItems: [
                  {
                    name: 'Dues for 2023',
                    quantity: '1',
                    note: '1st line item note',
                    basePriceMoney: {
                      amount: 575 * 100,
                      currency: 'USD'
                    }
                  }
                ]
            },        
            checkoutOptions: {
                allowTipping: false,
                merchantSupportEmail: 'hogbacksecretary@gmail.com',
                acceptedPaymentMethods: {
                    googlePay: true,
                    applePay: true,
                    afterpayClearpay: true,
                }
            },
            prePopulatedData: {
                buyerAddress: {
                    lastName: 'Member',
                    firstName: 'Hugh',
                },
                buyerEmail: 'hughe.member@gmail.com',
                buyerPhoneNumber: '+15853642343'
            }
        });
        console.log(Date.now() - start);
        console.log(response.result);
        console.log(response.result.paymentLink.url);
    } catch (error) {
        console.log(error);
    }
}

const handlePayment = async(payment) => {
    const { order_id, status } = payment.data.object.payment;
    console.log(`${order_id} ${status}`);
}

const paymentHook = {"merchant_id":"MLT8Y8YMJMAW6","type":"payment.updated","event_id":"9ce406b6-bd42-390e-b8c2-e79d8e0a7cf5","created_at":"2023-12-06T13:39:57.163Z","data":{"type":"payment","id":"D5wuQnj2PWmW2uXYFIF4IT6sNGaZY","object":{"payment":{"amount_money":{"amount":57500,"currency":"USD"},"application_details":{"application_id":"sandbox-sq0idb-lky4CaPAWmDnHY3YtYxINg","square_product":"ECOMMERCE_API"},"capabilities":["EDIT_AMOUNT_UP","EDIT_AMOUNT_DOWN","EDIT_TIP_AMOUNT_UP","EDIT_TIP_AMOUNT_DOWN"],"created_at":"2023-12-06T13:39:56.051Z","external_details":{"source":"Developer Control Panel","type":"CARD"},"id":"D5wuQnj2PWmW2uXYFIF4IT6sNGaZY","location_id":"L884JK4G6HVFZ","order_id":"R3pBdu4OX9lQ9sboZeFbI00Dvd4F","receipt_number":"D5wu","receipt_url":"https://squareupsandbox.com/receipt/preview/D5wuQnj2PWmW2uXYFIF4IT6sNGaZY","source_type":"EXTERNAL","status":"COMPLETED","total_money":{"amount":57500,"currency":"USD"},"updated_at":"2023-12-06T13:39:56.200Z","version":1}}}};

// handlePayment(paymentHook);

createLink();
