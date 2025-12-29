const axios = require('axios');

const BASE_URL = 'http://localhost:8000/api/v1/services';
const REQUEST_COUNT = 70; // Limit is 60, so this should trigger 429

async function runLoadTest() {
  console.log(`🚀 Starting Load Test on ${BASE_URL}...`);
  let success = 0;
  let limited = 0;
  let failed = 0;

  const promises = [];

  for (let i = 0; i < REQUEST_COUNT; i++) {
    promises.push(
      axios.get(BASE_URL)
        .then(() => {
          success++;
          process.stdout.write('.');
        })
        .catch((error) => {
          if (error.response && error.response.status === 429) {
            limited++;
            process.stdout.write('x');
          } else {
            failed++;
            process.stdout.write('!');
            // console.error(error.message);
          }
        })
    );
  }

  await Promise.all(promises);

  console.log('\n\n📊 Test Results:');
  console.log(`✅ Successful Requests: ${success}`);
  console.log(`⛔ Rate Limited (429):  ${limited}`);
  console.log(`💥 Other Failures:      ${failed}`);

  if (limited > 0) {
    console.log('✅ Rate Limiting is WORKING!');
  } else {
    console.log('❌ Rate Limiting is NOT working (or limit is too high).');
  }
}

runLoadTest();
