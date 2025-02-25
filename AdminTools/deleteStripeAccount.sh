echo "Enter the user's Stripe ID: "
read accountID

echo "Enter the Stripe Private Key: "
read stripeKey

curl -X DELETE https://api.stripe.com/v1/accounts/$accountID \
  -u $stripeKey