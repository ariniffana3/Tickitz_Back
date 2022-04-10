const midtransClient = require("midtrans-client");

const snap = new midtransClient.Snap({
  // isProduction: false,
  // serverKey: "SB-Mid-server-Ot4pjPNWWS88HlEfnLSWnLUa",
  // clientKey: "SB-Mid-client-eLduNOJQaF-hs6ht",
  isProduction: process.env.MIDTRANS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

module.exports = {
  post: (data) =>
    new Promise((resolve, reject) => {
      console.log("POST MIDTRANS RUN");
      const parameter = {
        transaction_details: {
          order_id: data.id,
          gross_amount: data.total,
        },
        credit_card: {
          secure: true,
        },
      };

      snap
        .createTransaction(parameter)
        .then((transaction) => {
          // transaction token
          // const transactionToken = transaction.token;
          // console.log("transactionToken:", transactionToken);
          //   console.log(transaction);
          //   {
          //     token: '77af457d-84a1-4eaa-8b42-49c2f0a1f7c3',
          //     redirect_url: 'https://app.sandbox.midtrans.com/snap/v2/vtweb/77af457d-84a1-4eaa-8b42-49c2f0a1f7c3'
          //   }
          resolve(transaction);
        })
        .catch((error) => {
          reject(error);
        });
    }),
  notif: (data) =>
    new Promise((resolve, reject) => {
      console.log("NOTIF MIDTRANS RUN");
      snap.transaction
        .notification(data)
        .then((statusResponse) => {
          //   console.log(statusResponse);
          resolve(statusResponse);
        })
        .catch((error) => {
          reject(error);
        });
    }),
};
