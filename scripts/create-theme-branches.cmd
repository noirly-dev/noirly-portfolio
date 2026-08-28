@echo off
setlocal enabledelayedexpansion

cd /d "%~dp0.."

for %%t in (blue gold forest coral violet teal rose) do (
  echo.
  echo === Creating branch theme/%%t ===
  git checkout -b theme/%%t 2>nul || git checkout theme/%%t
  echo @import "./%%t.css";> design-system\themes\active.css
  git add design-system/themes/active.css
  git commit -m "theme: activate %%t color palette" 2>nul
  if errorlevel 1 (
    echo Branch theme/%%t already committed or nothing to commit.
  )
)

git checkout redesign/framer-motion
echo.
echo Done. Branches created:
git branch --list "theme/*"
