import fastify from 'fastify';
import request from 'supertest';

import app from '../../app.js';
import Events from '../../models/Events.js';

jest.mock('../../models/Events.js')

beforeAll(async () => {
    await app.listen(3021); // Ensure the Fastify app is running on port 3021
  });
  
  afterAll(async () => {
    await app.close(); // Close the app after tests
   
  });


// TEST CASES FOR THE POSTING OF THE DATA

// Test case:1
// error -case when date in the past:
describe("Event Creation",()=>{
    test('should return 400 if the even date is in the past',async()=>{
        const pastDate=new Date('2020-01-01').toISOString();

        const response=await request(app)
        .POST('/create')
        .send({
            eventname: 'Test Event',
        eventdate: pastDate,  
        eventlocation: 'test location',
        amountrange: '100-200',
        eventtime: '12:00',
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error','Bad Request');
        expect(response.body.message).toBe('Event date must be in the future.')
    });
});

// Test case:2 Successful Event Creation

describe("Event Creation",()=>{

    test('should create the event successfully if all fields are valid',async ()=>{

        const futureDate=new Date(Date.now()+1000).toISOString();

        const response=await request(app)
        .post('/create')
        .send({
            eventname: 'Valid Event',
        eventdate: futureDate,  
        eventlocation: 'test location',
        amountrange: '100-200',
        eventtime: '12:00',
    });

    expect(response.status).toBe(200);

})
})

// Test case:3 

describe("Event Creation",()=>{
    test("should get  the error when some things wrong while event creation ",async ()=>{


 const mockSave = jest.fn().mockRejectedValue(new Error('Database Error'));
        Events.prototype.save = mockSave;


        const response=await request(app)
        .post('/create')
        .send({
            eventname: 'Valid Event',
        eventdate: new Date(Date.now()+1000).toISOString(),  
        eventlocation: 'test location',
        amountrange: '100-200',
        eventtime: '12:00',
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Database Error');


    })
})