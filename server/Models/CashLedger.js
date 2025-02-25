const BLANK_CASH_LEDGER = {
    venueID: null,
    showID: null,
    entries: {
        "Cash Sales": 0,
        "Bar Sales": 0
    },
    timestamp: Date.now()
}

export function generateBlankCashLedger(venueID, showID) {
    return {
        ...BLANK_CASH_LEDGER,
        venueID: venueID,
        showID: showID
    }
}