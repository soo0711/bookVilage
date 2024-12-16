FROM openjdk:17-jdk-slim

WORKDIR /app

# COPY만 docker-compose 파일의 위치를 기반으로 작동함
# docker-test-server내부에 있는 모든 파일을 WORKDIR인 /app으로 COPY를 한다는 의미이다.
COPY . .

# RUN은 현재 파일의 위치를 기반으로 작동함
RUN chmod +x ./gradlew
RUN ./gradlew clean build

# build.gradle에 어떤 설정을 하면 .jar파일이 1개가 만들어진다. (원래는 2개만들어짐)
# 만들어진 jar파일의 이름을 app.jar 로 변경한다는 의미이다. (실행하기 편하게)
#ARG JAR_FILE=build/libs/*.jar
#COPY ${JAR_FILE} app.jar

# 로컬에 빌드된게 아니라 컨테이너 내부에서 빌드된거니까 위에있는 COPY를 쓰면 안되고 RUN으로 실행시켜야한다.
ENV JAR_PATH=/app/build/libs
RUN mv ${JAR_PATH}/*.jar /app/app.jar

ENTRYPOINT ["java", "-jar","-Dspring.profiles.active=prod","app.jar"]