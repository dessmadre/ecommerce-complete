const User = require('../models/user');
const braintree = require('braintree');
const config = require('config');

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: config.get('BRAINTREE_MERCHANT_ID'),
  publicKey: config.get('BRAINTREE_PUBLIC_KEY'),
  privateKey: config.get('BRAINTREE_PRIVATE_KEY'),
});

exports.generateToken = (req, res) => {
  gateway.clientToken.generate({}, function (err, response) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(response);
    }
  });
};

exports.processPayment = (req, res) => {
  let nonceFromClient = req.body.paymentMethodNonce;
  let amountFromClient = req.body.amount;
  // charge
  let newTransaction = gateway.transaction.sale(
    {
      amount: amountFromClient,
      paymentMethodNonce: nonceFromClient,
      options: {
        submitForSettlement: true,
      },
    },
    (error, result) => {
      if (error) {
        res.status(500).json(error);
      } else {
        res.json(result);
      }
    }
  );
};
