# Appointment Service

## Requirements 
1. Provider can submit availability
2. Availability broken down into 15 min slots
3. Client can see available appointment slots
4. Client can reserve a slot
5. Client can confirm a slot
6. When clients reserve a slot, mark as reserved and set 30 min expiration
7. Reservation must be made more than 24 hours in advance
8. No double booking!
9. Check for expired res and update to available

## Endpoints
For information about request body and responses please see the [swagger doc](http://localhost:3000/api-docs/#/Clients/put_clients__clientId_) if running locally
### Provider Endpoints
- POST `/providers` - Create a new provider
- GET `/providers` - Get all providers
- GET `/providers/{providerId}` - Get a specific provider by ID
- PUT `/providers/{providerId}` - Update a provider's information
- DELETE `/providers/{providerId}` - Delete a provider by ID
- POST `/providers/{provider_id}/availability` - Submit availability for a provider
- GET `/providers/{provider_id}/availability` - Get all available slots for a provider

### Client Endpoint
- POST `/clients` - Create a new client
- GET `/clients` - Get all clients
- GET `/clients/{clientId}` - Get a specific client by ID
- PUT `/clients/{clientId}` - Update a client's information
- DELETE `/clients/{clientId}` - Delete a client by ID
- POST `/clients/{clientId}/reserve` - Reserve a slot for a client
- POST `/clients/{clientId}/confirm` - Confirm a reservation for a client

### Admin Endpoint
- POST `/admin/expire-reservations` - Expire reservations and release slots

## DB Schema 
(probably gonna be relational, don't see a need for this to be nosql)

### Provider
```
id
name
other metadata...
```

### Availability
```
id
startTime
endTime
providerId
other metadata...
```

### Slot
```
id
startTime
endTime
status
providerId
reservationId
other metadata...
```

### Client
```
id
name
email
phoneNumber
other metadata...
```

### Reservation
```
id
expiresAt
confirmedAt
slotId
clientId
```

## To-do list / Didn't get to in the 2-3 hr time :
### Paginate get availability 
Right now, it gets all the availability. It's fine for the current test DB I have, but as providers provide days or weeks of availability this list gets long.
So add query params for start and end date/time, and add pagination

### cron job 
In order to expire the non-confirmed reservation slots, there is an expire-reservation endpoint that can be hit manually.
But some sort of a scheduled job/cron needs to run every 30 minutes to expire reservations that's passed the 30 min confirmation window.
I didn't get to this in time, so a cron job would still need to be setup.

Another option would be to use a distributed lock with redis. With a TTL of 30 minutes
It'll allow only one process to access or modify a shared resource at a time, ensuring data consistency.

### Transactions for DB updates
Currently, I have the DB updates happen sequentially. Ideally they would be in a transaction. So when multiple tables need to be updated, if one fails all the other related updates can be rolled back. This way we won't be in a situation where an appointment is created, but the slot is empty.

### unit and integration tests
Unfortunately I didn't get to write up the tests. But I did list up some of the test cases that should be tests in src/tests/test.md

### provider update
The biggest issue with the current implementation is around provider update. Since this wasn't really specified in the requirements and a lot of my questions would usually involve conversations with PMs, I've decided to keep the simple implementation and list my questions and potential edge cases here.
- With the current implementation, any updates to a providers availability would wipe out any existing reservations
- If we were to add in an availability update feature, these cases would need to be considered
    - if new available time is outside of any existing confirmed reservations
        Initial availability is 8:00 - 10:00. Client confirms a 9:00-9:15 slot. Provider updates avail to 10:00-13:00.  The 9:00-9:15 slot would need to be either cancelled or moved to the next available slot

### Out of scope for this take home?
#### Authentication
JWT + OAuth (Identification and Authorization)
Who is who, and who can access what. Would be needed in an actual system, but out of scope here

#### Appointment Cancellation
There wasn't any requirements in the take-home that touched on cancellation, so I left it out of the implementation.
But a simple way would just be a new endpoint that both the client and provider can hit and mark the slot as available.

#### docker + k8s
deploy apps that are consistent and scalable

## To Run Locally
#### Required Packages
Couldn't get the linter to work, so had to prioritize and skip the linter
```
npm install express pg typeorm typescript ts-node @types/node @types/express body-parser swagger-jsdoc swagger-ui-express tslint swagger-autogen
```
#### Build
```
npm run build
```
#### Run
```
npm run start
```
#### Dev Mode
```
npm run dev
```

[Download Node.js](https://nodejs.org/en/download/package-manager)

[Quick TypeScript + Node.js + Express Setup](https://blog.logrocket.com/how-to-set-up-node-typescript-express/)
