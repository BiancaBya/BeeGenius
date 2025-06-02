#  ===============================
#  STADIUL 1: build Gradle
#  ===============================
FROM eclipse-temurin:21-jdk-jammy AS build

# Setăm directorul de lucru în container
WORKDIR /workspace

# Copiem fișierele necesare build-ului
COPY gradlew ./
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src

# Asigurăm permisiunea de execuție pentru gradlew
RUN chmod +x gradlew

# Construim JAR-ul fără teste
RUN ./gradlew clean bootJar -x test

#  ===============================
#  STADIUL 2: imagine finală
#  ===============================
FROM eclipse-temurin:21-jre-jammy

# Folderul în care va rula aplicația
WORKDIR /app

# Copiem JAR-ul generat în etapa de build
COPY --from=build /workspace/build/libs/backend-0.0.1-SNAPSHOT.jar app.jar

# Expunem portul pe care Spring Boot ascultă (default 8080)
EXPOSE 8080

# Comanda care pornește aplicația
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
