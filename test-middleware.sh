#!/bin/bash

echo "🎯 AdonisJS Middleware Learning Lab - Test Suite"
echo "================================================="
echo ""

BASE_URL="http://localhost:3333"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}1. 🌍 Testing Global Middleware (Public Endpoint)${NC}"
echo "   → Only global middleware runs here"
curl -s "$BASE_URL/demo/public" | head -c 100
echo -e "\n"

echo -e "${BLUE}2. 🔐 Testing Authentication Middleware${NC}"
echo -e "   ${RED}❌ Without token (should fail):${NC}"
curl -s "$BASE_URL/demo/protected" | head -c 100
echo -e "\n"

echo -e "   ${GREEN}✅ With valid token (should work):${NC}"
curl -s -H "Authorization: Bearer user-token-123" "$BASE_URL/demo/protected" | head -c 150
echo -e "\n"

echo -e "${BLUE}3. 👑 Testing Admin Authorization${NC}"
echo -e "   ${RED}❌ User trying to access admin (should fail):${NC}"
curl -s -H "Authorization: Bearer user-token-123" "$BASE_URL/demo/admin" | head -c 100
echo -e "\n"

echo -e "   ${GREEN}✅ Admin accessing admin endpoint (should work):${NC}"
curl -s -H "Authorization: Bearer admin-token-456" "$BASE_URL/demo/admin" | head -c 150
echo -e "\n"

echo -e "${BLUE}4. 🚦 Testing Rate Limiting${NC}"
echo "   → Making 3 quick requests to strict rate-limited endpoint"
for i in {1..3}; do
  echo -e "   Request $i:"
  curl -s "$BASE_URL/demo/rate-limited" | head -c 80
  echo ""
done
echo ""

echo -e "${BLUE}5. 📱 Testing Device Detection${NC}"
echo -e "   ${YELLOW}Desktop User-Agent:${NC}"
curl -s -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0" "$BASE_URL/demo/device" | head -c 120
echo -e "\n"

echo -e "   ${YELLOW}Mobile User-Agent:${NC}"
curl -s -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)" "$BASE_URL/demo/device" | head -c 120
echo -e "\n"

echo -e "${BLUE}6. 🚩 Testing Feature Flags${NC}"
echo -e "   ${GREEN}✅ Beta feature (50% rollout - enabled):${NC}"
curl -s "$BASE_URL/demo/beta" | head -c 100
echo -e "\n"

echo -e "   ${RED}❌ Experimental feature (disabled):${NC}"
curl -s "$BASE_URL/demo/experimental" | head -c 100
echo -e "\n"

echo -e "${BLUE}7. 🎯 Testing Multiple Middleware Chain${NC}"
echo "   → Auth + Device Detection + Feature Flag"
curl -s -H "Authorization: Bearer user-token-123" -H "User-Agent: Mozilla/5.0 (iPhone)" "$BASE_URL/demo/multiple" | head -c 150
echo -e "\n"

echo -e "${BLUE}8. 🔄 Testing Response Transformation${NC}"
curl -s "$BASE_URL/demo/transform" | head -c 120
echo -e "\n"

echo -e "${BLUE}9. 📝 Testing POST with Middleware${NC}"
curl -s -X POST -H "Authorization: Bearer user-token-123" -H "Content-Type: application/json" -d '{"title":"Test","content":"Hello middleware!"}' "$BASE_URL/demo/create" | head -c 150
echo -e "\n"

echo -e "${GREEN}🎉 Middleware testing complete!${NC}"
echo -e "${YELLOW}💡 Check the server logs to see detailed middleware execution flow${NC}"
echo ""
echo -e "${BLUE}📋 Available endpoints:${NC}"
echo "   • $BASE_URL/ (overview)"
echo "   • $BASE_URL/demo/public (global middleware only)"
echo "   • $BASE_URL/demo/protected (auth required)"
echo "   • $BASE_URL/demo/admin (admin only)"
echo "   • $BASE_URL/demo/rate-limited (rate limited)"
echo "   • $BASE_URL/demo/device (device detection)"
echo "   • $BASE_URL/demo/multiple (multiple middleware)"
echo ""
echo -e "${YELLOW}🔑 Test tokens:${NC}"
echo "   • user-token-123 (regular user)"
echo "   • admin-token-456 (admin user)"
echo "   • demo-token-789 (demo user)"
