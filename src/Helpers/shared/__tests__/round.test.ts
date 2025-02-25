import { describe, test, expect } from "@jest/globals";
import { round } from "../calculateCartTotal";
// import { round } from "../round.js";

describe("round", () => {
    // const mockCartFeesIncluded = {
    //     0: {
    //         quantity: 5,
    //         price: "10",
    //         showID: "24741300",
    //         feesIncluded: true,
    //     },
    // };

    // const mockCartCustomTax = {
    //     0: {
    //         quantity: 5,
    //         price: "10",
    //         showID: "24741300",
    //         customFee: 2.7,
    //         customTax: 2.1,
    //     },
    // };

    // const mockCart = {
    //     0: {
    //         quantity: 5,
    //         price: "10",
    //         showID: "24741300",
    //     },
    // };

    test("can handle scientific notation (negative)", () => {
        const result = round(1.23e-10);
        expect(result).toEqual(0);
    });

    test("can handle scientific notation (positive)", () => {
        const result = round(93.9324e10);
        expect(result).toEqual(939324000000);
    });

    test("can round small decimals", () => {
        const result = round(1.01623534232);
        expect(result).toEqual(1.02);
    });
});
