#!/bin/bash
echo "stop SpringBoot BAppApiServerApplication"
pid=`ps -ef | grep sso-0.0.1-SNAPSHOT.jar | grep -v grep | awk '{print $2}'`
if [ -n "$pid" ]
then
kill -9 $pid
fi

export JAVA_HOME=/usr/java/jdk1.8.0_17
chmod 777 /opt/exec/sso/sso-0.0.1-SNAPSHOT.jar
cd /opt/exec/sso/
nohup java -jar sso-0.0.1-SNAPSHOT.jar > temp.txt 2>&1 &
echo "start successfully"
sleep 1s
exit 0
