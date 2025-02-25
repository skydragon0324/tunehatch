// import { describe, test, expect } from "@jest/globals";
// import { calculateCartTotal } from "../calculateCartTotal";

// describe("calculateCartTotal", () => {
// //   const mockCartFeesIncluded = {
// //     0: {
// //       quantity: 5,
// //       price: "10",
// //       showID: "24741300",
// //       feesIncluded: true,
// //     },
// //   };

describe('First test', () => {
    it('should pass', () => {
        expect(true).toBe(true);
    });
});

//   const mockCartCustomTax = {
//     0: {
//       quantity: 5,
//       price: "10",
//       showID: "24741300",
//       customFee: 2.7,
//       customTax: 2.1,
//     },
//   };

//   const mockCart = {
//     0: {
//       quantity: 5,
//       price: "10",
//       showID: "24741300",
//     },
//   };

//   test("is correct with custom fee and custom tax", () => {
//     const result = calculateCartTotal(mockCartCustomTax, undefined);
//     expect(result).toEqual({
//       base_cost: 50,
//       fee: 13.5,
//       stripeTotal: 7400,
//       tax: 10.5,
//       total: 74,
//       venueCost: {
//         fee: 0,
//         tax: 0,
//       },
//     });
//   });
//   // check tax order here
//   // test('is correct with fees included', () => {
//   //     const result = calculateCartTotal(mockCartFeesIncluded, undefined, undefined);
//   //     expect(result).toEqual({
//   //         "base_cost": 50,
//   //         "fee": 0,
//   //         "stripeTotal": 5000,
//   //         "tax": 0,
//   //         "total": 50,
//   //         "venueCost": {
//   //             "fee": 10.3,
//   //             "tax": 4.63,
//   //         }
//   //     });
//   // });

//   test("is correct when fee_percentage is provided", () => {
//     const result = calculateCartTotal(mockCart, 3);
//     expect(result).toEqual({
//       base_cost: 50,
//       fee: 1.94,
//       stripeTotal: 5657,
//       tax: 4.63,
//       total: 56.57,
//       venueCost: {
//         fee: 0,
//         tax: 0,
//       },
//     });
//   });

//   test("returns false when cart is not supplied", () => {
//     // const result = calculateCartTotal();
//   });

//   describe("quantity", () => {
//     test("error when quantity is < 1", () => {
//       expect(true).toBeTruthy();
//     });
//   });
// });
