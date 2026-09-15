@echo off
title Crypto Airdrop AI - Autonomous Batch Publishing Engine (3x3x3)
color 0B
cd /d "%~dp0"

echo ===============================================================================
echo     CRYPTO AIRDROP AI - AUTONOMOUS BATCH PUBLISHING ENGINE (3x3x3)
echo ===============================================================================
echo.
echo   [*] Target: 3 Projects + 3 Intelligence Articles + 3 Guides Playbooks
echo   [*] Standard: Topic-Specific Bespoke Visuals, Full Invariants, Live Deploy
echo.
echo ===============================================================================
echo.

python automation\batch_runner.py

if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo [ERROR] Batch automation encountered a failure. Please check logs above.
    echo.
) else (
    color 0A
    echo.
    echo [SUCCESS] Batch automation completed and pushed to production!
    echo.
)

pause
