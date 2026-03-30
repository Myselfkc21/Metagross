import http from 'k6/http';
import { sleep, check } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// custom metrics
const errorRate = new Rate('error_rate');
const executionDuration = new Trend('execution_duration', true);

export const options = {
  stages: [
    { duration: '30s', target: 10 }, // ramp up to 10 concurrent users
    { duration: '1m', target: 50 }, // hold at 50 concurrent users
    { duration: '30s', target: 0 }, // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'], // 95% of requests under 3s
    error_rate: ['rate<0.1'], // error rate under 10%
  },
};

const BASE_URL = 'https://krishna-chaitanya.xyz';

export default function () {
  const payload = JSON.stringify({
    workflowId: 1,
    input:
      'stress test input - generate a short summary of artificial intelligence',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const startTime = Date.now();
  const res = http.post(`${BASE_URL}/execution/execute`, payload, params);
  const duration = Date.now() - startTime;

  // track metrics
  executionDuration.add(duration);
  errorRate.add(res.status >= 400);

  // check response
  const success = check(res, {
    'status is 200 or 201': (r) => r.status === 200 || r.status === 201,
    'response has data': (r) => r.body && r.body.length > 0,
  });

  if (!success) {
    console.log(`FAILED — status: ${res.status} | body: ${res.body}`);
  }

  sleep(1);
}

export function handleSummary(data) {
  return {
    stdout: textSummary(data, { indent: '  ', enableColors: true }),
    'summary.json': JSON.stringify(data),
  };
}

import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
