const Twilio = require('twilio');

const accountSid = 'AC5abcf4f220a4eebd411b3b0b8a118f03';
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = new Twilio(accountSid, authToken);

module.exports = {
  sendSMS: async(to, from, body) =>{
    const resp = await client.messages.create({
      body,
      to,
      from
    });
    return resp;
  }
}