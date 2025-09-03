#!/bin/bash

# 🧪 Cookie & Session Testing Script
# This script tests the implementation to make sure everything works

echo "🍪💾 Testing Cookies & Sessions Implementation"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SERVER_URL="http://127.0.0.1:3333"

# Check if server is running
echo -e "${BLUE}🔍 Checking if server is running...${NC}"
if curl -s "$SERVER_URL" > /dev/null; then
    echo -e "${GREEN}✅ Server is running!${NC}"
else
    echo -e "${RED}❌ Server is not running. Please run 'npm run dev' first.${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}📋 Testing Cookie & Session Endpoints:${NC}"
echo ""

# Test Overview
echo -e "${BLUE}1. Testing Overview Endpoint...${NC}"
response=$(curl -s "$SERVER_URL/demo/cookies-sessions")
if [[ $response == *"Cookie & Session Learning Lab"* ]]; then
    echo -e "${GREEN}   ✅ Overview endpoint working${NC}"
else
    echo -e "${RED}   ❌ Overview endpoint failed${NC}"
fi

# Test Cookie Operations
echo -e "${BLUE}2. Testing Cookie Operations...${NC}"

echo -e "${BLUE}   - Setting basic cookie...${NC}"
response=$(curl -s "$SERVER_URL/demo/cookies/set-basic")
if [[ $response == *"Cookie Management Demo"* ]]; then
    echo -e "${GREEN}   ✅ Basic cookie endpoint working${NC}"
else
    echo -e "${RED}   ❌ Basic cookie endpoint failed${NC}"
fi

echo -e "${BLUE}   - Setting secure cookie...${NC}"
response=$(curl -s "$SERVER_URL/demo/cookies/set-secure")
if [[ $response == *"Cookie Management Demo"* ]]; then
    echo -e "${GREEN}   ✅ Secure cookie endpoint working${NC}"
else
    echo -e "${RED}   ❌ Secure cookie endpoint failed${NC}"
fi

echo -e "${BLUE}   - Testing shopping cart cookie...${NC}"
response=$(curl -s "$SERVER_URL/demo/cookies/shopping-cart")
if [[ $response == *"Cookie Management Demo"* ]]; then
    echo -e "${GREEN}   ✅ Shopping cart cookie endpoint working${NC}"
else
    echo -e "${RED}   ❌ Shopping cart cookie endpoint failed${NC}"
fi

# Test Session Operations
echo -e "${BLUE}3. Testing Session Operations...${NC}"

echo -e "${BLUE}   - Initializing session...${NC}"
response=$(curl -s "$SERVER_URL/demo/sessions/init")
if [[ $response == *"Session Management Demo"* ]]; then
    echo -e "${GREEN}   ✅ Session init endpoint working${NC}"
else
    echo -e "${RED}   ❌ Session init endpoint failed${NC}"
fi

echo -e "${BLUE}   - Testing session shopping cart...${NC}"
response=$(curl -s "$SERVER_URL/demo/sessions/shopping-cart")
if [[ $response == *"Session Management Demo"* ]]; then
    echo -e "${GREEN}   ✅ Session cart endpoint working${NC}"
else
    echo -e "${RED}   ❌ Session cart endpoint failed${NC}"
fi

echo -e "${BLUE}   - Testing flash messages...${NC}"
response=$(curl -s "$SERVER_URL/demo/sessions/flash")
if [[ $response == *"Session Management Demo"* ]]; then
    echo -e "${GREEN}   ✅ Flash messages endpoint working${NC}"
else
    echo -e "${RED}   ❌ Flash messages endpoint failed${NC}"
fi

# Test Comparison Endpoints
echo -e "${BLUE}4. Testing Comparison Endpoints...${NC}"

echo -e "${BLUE}   - Testing cookie vs session comparison...${NC}"
response=$(curl -s "$SERVER_URL/demo/cookies-vs-sessions")
if [[ $response == *"Cookie vs Session Comparison"* ]]; then
    echo -e "${GREEN}   ✅ Comparison endpoint working${NC}"
else
    echo -e "${RED}   ❌ Comparison endpoint failed${NC}"
fi

echo -e "${BLUE}   - Testing shopping cart comparison...${NC}"
response=$(curl -s "$SERVER_URL/demo/shopping-cart-comparison")
if [[ $response == *"Shopping Cart Comparison Demo"* ]]; then
    echo -e "${GREEN}   ✅ Cart comparison endpoint working${NC}"
else
    echo -e "${RED}   ❌ Cart comparison endpoint failed${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Basic functionality test completed!${NC}"
echo ""
echo -e "${YELLOW}🚀 Next Steps:${NC}"
echo "1. Open your browser to http://127.0.0.1:3333/demo/cookies-sessions"
echo "2. Test the endpoints manually in your browser"
echo "3. Open browser developer tools to see cookies"
echo "4. Read the comprehensive guide: COOKIES_SESSIONS_GUIDE.md"
echo ""
echo -e "${BLUE}💡 Pro Tips:${NC}"
echo "• Use browser dev tools (F12) → Application → Cookies"
echo "• Check Network tab to see Set-Cookie headers"
echo "• Try the endpoints in different order to see state changes"
echo "• Compare cookie vs session approaches for shopping cart"
echo ""
echo -e "${GREEN}Happy learning! 🎓${NC}"
