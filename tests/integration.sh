#!/bin/bash
set -e

API_URL="${API_URL:-http://localhost:4039/api}"
PASS=0
FAIL=0

assert_status() {
  local name="$1"
  local expected="$2"
  local actual="$3"
  if [ "$actual" -eq "$expected" ]; then
    echo "✅ $name (HTTP $actual)"
    PASS=$((PASS + 1))
  else
    echo "❌ $name (expected $expected, got $actual)"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== PitchPulse Integration Tests ==="
echo "API: $API_URL"
echo ""

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health")
assert_status "Health Check" 200 "$HTTP_CODE"

LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@modastudyo.com","password":"demo123456"}')
HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -1)
BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')
assert_status "Login" 200 "$HTTP_CODE"

TOKEN=$(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin)['accessToken'])" 2>/dev/null || echo "")

if [ -z "$TOKEN" ]; then
  echo "❌ Could not extract token"
  exit 1
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/dashboard/stats" -H "Authorization: Bearer $TOKEN")
assert_status "Dashboard Stats" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/clients" -H "Authorization: Bearer $TOKEN")
assert_status "List Clients" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/sessions" -H "Authorization: Bearer $TOKEN")
assert_status "List Sessions" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/deliveries" -H "Authorization: Bearer $TOKEN")
assert_status "List Deliveries" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/studio-rooms" -H "Authorization: Bearer $TOKEN")
assert_status "List Studio Rooms" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/equipment" -H "Authorization: Bearer $TOKEN")
assert_status "List Equipment" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/studio" -H "Authorization: Bearer $TOKEN")
assert_status "Get Studio Profile" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/studio" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -X PATCH \
  -d '{"city":"İstanbul"}')
assert_status "Update Studio Profile" 200 "$HTTP_CODE"

CREATE_CLIENT=$(curl -s -w "\n%{http_code}" "$API_URL/clients" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"artistName":"Test Sanatçı","contactName":"Deniz Koç","phone":"0544 999 88 77","city":"İstanbul","genre":"Rock"}')
HTTP_CODE=$(echo "$CREATE_CLIENT" | tail -1)
assert_status "Create Client" 201 "$HTTP_CODE"

CLIENT_ID=$(echo "$CREATE_CLIENT" | sed '$d' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")

if [ -n "$CLIENT_ID" ]; then
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/clients/$CLIENT_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    -X PATCH \
    -d '{"notes":"İlk EP kaydı"}')
  assert_status "Update Client" 200 "$HTTP_CODE"

  CREATE_SESSION=$(curl -s -w "\n%{http_code}" "$API_URL/sessions" \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    -d "{\"date\":\"2027-02-15T10:00:00Z\",\"type\":\"recording\",\"clientId\":\"$CLIENT_ID\"}")
  SESSION_CODE=$(echo "$CREATE_SESSION" | tail -1)
  assert_status "Create Session" 201 "$SESSION_CODE"

  SESSION_ID=$(echo "$CREATE_SESSION" | sed '$d' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")

  if [ -n "$SESSION_ID" ]; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/sessions/$SESSION_ID" \
      -H "Authorization: Bearer $TOKEN" \
      -X DELETE)
    assert_status "Delete Session" 200 "$HTTP_CODE"
  fi

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/clients/$CLIENT_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -X DELETE)
  assert_status "Delete Client" 200 "$HTTP_CODE"
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/dashboard/stats")
assert_status "Unauthorized Access" 401 "$HTTP_CODE"

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
