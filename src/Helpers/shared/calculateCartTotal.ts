//updated; unable to use with TS on the backend.
export function round(num: number, scale?: number) {
  scale = scale || 2;
  if (!("" + num).includes("e")) {
    return +(Math.round(Number(num + "e+" + scale)) + "e-" + scale);
  } else {
    var arr = ("" + num).split("e");
    var sig = "";
    if (+arr[1] + scale > 0) {
      sig = "+";
    }
    return +(
      Math.round(Number(+arr[0] + "e" + sig + (+arr[1] + scale))) +
      "e-" +
      scale
    );
  }
}

export function calculateCartTotal(
  cart: {
    [x: string]: { [x: string]: any };
    0?:
      | {
          quantity?: number;
          price?: string;
          showID?: string;
          customFee?: number;
          customTax?: number;
        }
      | {
          quantity?: number;
          price?: string;
          customFee?: number;
          customTax?: number;
          showID?: string;
        };
  },
  tax_rate?: number
) {
  //Fee breakpoints
  let fee_percentage = 20;
  let tax = 0;
  let fee = 0;
  let venueFee = 0;
  let stripeTotal = 0;
  let total;
  let custom = false;
  let feesIncluded = false;
  if (cart) {
    let cartKeys = Object.keys(cart);
    fee_percentage = fee_percentage ? fee_percentage / 100 : 20 / 100;
    tax_rate = tax_rate / 100 || 9.25 / 100;
    let base_cost = 0;
    let venueCost = {
      tax: 0,
      fee: 0,
    };
    for (const showID of cartKeys || []) {
      let itemKeys = Object.keys(cart[showID]);
      for (const cartItem of itemKeys || []) {
        let fee_percentage = 20;
        let item = cart[showID][cartItem];
        let itemPrice = Number(item.price);
        if (itemPrice <= 5) {
          fee_percentage = 19;
        } else if (itemPrice > 50) {
          fee_percentage = 10;
        } else {
          fee_percentage = 20;
        }
        fee_percentage = fee_percentage / 100;
        //determine fee
        console.log(item);
        if (item.quantity > 0) {
          base_cost = base_cost + itemPrice * item.quantity;
          if (feesIncluded) {
            venueCost.fee =
              Number(item.customFee) >= 0
                ? fee + item.customFee
                : fee + round(base_cost * fee_percentage);
            venueCost.tax =
              Number(item.customTax) >= 0
                ? tax + item.customTax
                : tax + round((base_cost + fee) * tax_rate);
          } else {
            venueFee = venueFee + Number(item.venueFee ? (item.venueFee * item.quantity) : 0);
            fee =
              Number(item.customFee) >= 0
                ? fee + (item.customFee * item.quantity)
                : fee + round((base_cost + item.venueFee) * fee_percentage);
            tax =
              Number(item.customTax) >= 0
                ? tax + (item.customTax * item.quantity)
                : tax + round((base_cost + fee) * tax_rate);
          }
        }
        if (item.customTax || item.customFee) {
          custom = true;
        }
      }
    }
    total = round(base_cost + fee);
    let stripeFee = round(Number(total) * 0.029 + 0.3);
    console.log(stripeFee, fee);
    if (!feesIncluded) {
      if (!custom && base_cost > 0) {
        fee = fee + Number(stripeFee);
      }
    } else {
      if (!custom && base_cost > 0) {
        venueCost.fee = venueCost.fee + Number(stripeFee);
      }
    }
    tax = round(tax);
    fee = round(fee);
    total = round(base_cost + tax + fee + venueFee);
    stripeTotal = Number(total) * 100;
    stripeTotal = Math.trunc(stripeTotal);
    return { base_cost, fee, venueFee, tax, total, stripeTotal, venueCost };
  } else {
    console.log("Error: cart not supplied.");
  }
}
