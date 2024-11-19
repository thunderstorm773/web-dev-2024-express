const axios = require('axios');

async function testPostUniversityRequest() {
  try {
    const response = await axios.post('http://localhost:3000/university', {
      name: 'Sofia University',
      town: 'Sofia'
    });
    console.log('Response data:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

async function testPostUserRequest() {
  try {
    const response = await axios.post('http://localhost:3000/user', {
      name: 'Vasil Doe',
      email: 'vasil@example.com',
      universityId: 1,
      subjectIds: [1, 2]
    });
    console.log('Response data:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

async function testPostSubjectRequest() {
  try {
    const response = await axios.post('http://localhost:3000/subject', {
      name: 'Chemistry'
    });
    console.log('Response data:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}


(async () => {
  //await testPostUniversityRequest();
  await testPostUserRequest()
  //await testPostSubjectRequest()
})()