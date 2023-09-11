const midtransClient = require("midtrans-client");

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

module.exports = {
  post: (data) =>
    new Promise((resolve, reject) => {
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
          resolve(transaction);
        })
        .catch((error) => {
          reject(error);
        });
    }),
  notif: (data) =>
    new Promise((resolve, reject) => {
      snap.transaction
        .notification(data)
        .then((statusResponse) => {
          resolve(statusResponse);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    }),
};
