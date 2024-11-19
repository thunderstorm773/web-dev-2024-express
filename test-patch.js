const axios = require('axios');

/** Change URL and body according to implementation. */
async function testPatchRequest() {
  try {
    const response = await axios.patch('http://localhost:3000/user/1/add-subjects', {
      name: 'Ivan Doe',
      email: 'ivan@example.com',
      subjectIds: [3]
    });
    console.log('Response data:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testPatchRequest();
