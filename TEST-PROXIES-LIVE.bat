@echo off
color 0B
title Testing Proxies - Live Check
echo.
echo ========================================
echo   TESTING ALL PROXIES...
echo ========================================
echo.
echo Please wait, testing each proxy...
echo.
node test-proxies-simple.js
echo.
echo ========================================
echo   TEST COMPLETE!
echo ========================================
echo.
echo Check the results above.
echo.
echo Dead proxies are marked in RED
echo Working proxies are marked in GREEN
echo.
pause
