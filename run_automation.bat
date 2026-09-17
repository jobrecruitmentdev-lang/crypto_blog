@echo off
title Crypto Airdrop AI - Autonomous Batch Publishing Engine (3x3x3)
color 0B
cd /d "%~dp0"

echo ===============================================================================
echo     CRYPTO AIRDROP AI - AUTONOMOUS BATCH PUBLISHING ENGINE (3x3x3)
echo ===============================================================================
echo.
echo   [*] Target:   3 Fresh Projects + 3 Intelligence Articles + 3 Guides Playbooks
echo   [*] Standard: Live DeFi Scraping, Groq LLM Writing, Bespoke 3D AI Visuals
echo   [*] Security: Zero Duplicates Contract, Next.js Build Gate, Live Hostinger Sync
echo.
echo ===============================================================================
echo.

python automation\batch_runner.py

if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo ===============================================================================
    echo [ERROR] Batch automation encountered a failure. Please check logs above.
    echo ===============================================================================
    echo.
) else if exist "automation\pending_prompts.json" (
    color 0E
    echo.
    echo ===============================================================================
    echo [NEXT STEP] Batch content is 100%% ready!
    echo             Open Antigravity chat and say:
    echo             "batch images generate karke live kardo"
    echo ===============================================================================
    echo.
) else (
    color 0A
    echo.
    echo ===============================================================================
    echo [SUCCESS] 100%% Batch automation completed and pushed to production live!
    echo ===============================================================================
    echo.
)

pause
