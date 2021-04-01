@echo off
set PATH=%PATH%;
title RYUJIN CHECKER SERVICES
:ryujin
mshta javascript:alert("WELCOME TO RYUJIN CHECKER SERVICES ");close();
node index.js

@echo off
:installer
mshta javascript:alert("node_modules not installed , click OK to install!");close();
npm install
mshta javascript:alert("node_modules installed , run again !");close();
pause
cls
IF exist node_modules\ (

	goto ryujin
	) ELSE (
	goto installer
	)