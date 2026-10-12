@echo off
set IP=31.97.61.136
set USER=root
set PASSWORD="C;vx#5kLpR)&&8/9C7-0"

plink.exe -ssh %USER%@%IP% -pw "%PASSWORD%"

pause