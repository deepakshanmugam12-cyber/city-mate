@echo off
title CITYMATE - Smart Tourist Companion
echo ========================================================
echo        CITYMATE - Smart Tourist Companion
echo ========================================================
echo.
echo [1/3] Checking Python installation...
py --version >nul 2>&1
if %errorlevel% equ 0 (
    set PY_CMD=py
    goto found_py
)

python --version >nul 2>&1
if %errorlevel% equ 0 (
    set PY_CMD=python
    goto found_py
)

echo.
echo [!] Python was not detected in PATH.
echo [i] You can still open frontend\index.html in any browser or with VS Code Live Server!
echo Opening frontend\index.html now...
start frontend\index.html
pause
exit /b

:found_py
echo [i] Using %PY_CMD%
echo.
echo [2/3] Installing dependencies from requirements.txt...
%PY_CMD% -m pip install -r requirements.txt
echo.
echo [3/3] Launching CityMate Flask Server with SQLite database...
echo.
echo Server will run at: http://127.0.0.1:5000
echo Opening browser in 3 seconds...
start http://127.0.0.1:5000
%PY_CMD% app.py
pause
