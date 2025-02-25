export const updateTicketsQuery = `UPSERT {showID: @showID}
            INSERT {
                showID: @showID,
                venueID: @venueID,
                soldTickets: @tickets
            }
            UPDATE {soldTickets: MERGE(OLD.soldTickets, @tickets)} IN tickets`