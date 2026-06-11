@echo off
echo Cleaning node_modules folder...
echo.

if exist node_modules (
    echo Removing node_modules...
    rmdir /s /q node_modules
    echo Done! node_modules folder has been deleted.
) else (
    echo node_modules folder does not exist.
)

echo.
pause
