import { round } from "./calculateCartTotal";

export function getFinalTicketPrice(
    base_cost: number,
    quantity: number,
    fee_percentage: number,
    tax_rate: number,
    fees_included: boolean,
) {
    if (base_cost && quantity) {
        if (fees_included) {
            let total = round(base_cost * quantity);
            return { base_cost, fee: 0, tax: 0, total };
        } else {
            fee_percentage =
                fee_percentage / 100 ||
                parseInt(process.env.REACT_APP_FEE_PERCENTAGE, 10) / 100;
            tax_rate = tax_rate / 100 || 9.25 / 100;
            let tax = round(base_cost * quantity * tax_rate);
            let fee = round(
                (base_cost * quantity + tax) * fee_percentage + 0.3,
            );
            let total = round(base_cost * quantity + tax + fee);
            return { base_cost, fee, tax, total };
        }
    } else {
        console.log("Error: base cost or quantity not specified.");
        return false;
    }
}
