import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up to 20 users
    { duration: '1m', target: 50 },  // Stay at 50 users
    { duration: '20s', target: 0 },  // Ramp down
  ],
};

const BASE_URL = 'http://localhost:8000/api/v1';

export default function () {
  // Test Project List (Cached)
  const res = http.get(`${BASE_URL}/projects`);
  check(res, { 'status was 200': (r) => r.status == 200 });

  // Test Services List (Cached)
  const res2 = http.get(`${BASE_URL}/services`);
  check(res2, { 'status was 200': (r) => r.status == 200 });

  sleep(1);
}
