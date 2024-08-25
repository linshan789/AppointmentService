Sorry, I didn't get to the unit and integration tests within the 2ish hours.
But these would be some of the tests cases that should be written. I'll continue to update this page as more come to mind.

CRUD For Client and Provider (All cases are for client, but the same applies for provider, didn't think I need to list pretty much the same thing twice)

Client Create
- Create a client with valid data > client created
- Create a client with existing email > rejected with error msg
- Create a client with missing data/email/etc > req rejected with appropriate error msg

Client Read
- Get all client > all client retrieved
- Get client by ID > correct client returned 
- Get client with bad ID > return 404

Client Update
- Update client info > client updated
- Update non-existent client > 404

Client Delete
- Delete client by ID > client deleted
- Delete non-existent client > 404

-------
Reservation
- Reserve more than 24 hours in advance > Reservation created successfully and in confirm state
- Reserve less than 24 hours in advance > Request rejected with error message
- Reserve a slot that was already reserved > Req rejected with error message
- Reserve a non-existent slot > Req rejected with error message

Confirmation
- Confirm a reservation before expiration > confirmation successful
- Confirm an expired reservation > confirmation request rejected
- Confirm a reservation that's past it's 30 minute window > confirmation rejected

Admin/Expire Reservation
- Run Expire Reservation > confirm all reservations pasted it's expiresAt time and not confirmed are back to available
- Run Expire Reservation when no reservations match the expire criteria > nothing gets updated

Slot
- List all available slots > only those marked as available are returned
- List all available slots when there are none available > empty list
- List available slots for a bad provider id > 404/maybe an empty list tbd

Provider/Availability 
- Enter valid availability > 15 min slots are generated for the available time.
- Enter valid availability but not in a perfect 15min block (like, 10:00 - 11:12) > only 10:00 - 11:00 are slotted
- 11:12 - 12:12 > should be 4 slots
- Enter overlapping availability - No double slots for the same time
- Invalid time range, start time is after end time > reject, bad request

- JSON validation > 400
- Bad routes > 404



