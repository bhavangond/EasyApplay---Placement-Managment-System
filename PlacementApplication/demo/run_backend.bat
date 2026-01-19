@echo off
echo Setting JAVA_HOME to avoid space issues...
set "JAVA_HOME=C:\PROGRA~1\Java\jdk-25"
echo JAVA_HOME is now: %JAVA_HOME%

echo Starting Backend...
call mvnw.cmd spring-boot:run
