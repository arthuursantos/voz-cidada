package com.fiec.voz_cidada.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;

@Configuration
public class FirebaseConfig {

@Bean
public FirebaseApp firebaseApp() throws IOException {
// guardar o arquivo firebase.json na pasta resource, E NÃO FAZER O PUSH DESSE ARQUIVO NO GIT!
    if(!Files.exists(Path.of("firebase_pre.json"))){
        createFileFromString("firebase.json", System.getenv("FIREBASE_PK"));
    } else {
        createFileFromString("firebase.json", Files.readString(Path.of("firebase_pre.json")));

    }
        File file = new File("firebase.json");
        InputStream serviceAccount = new FileInputStream(file);
        FirebaseOptions options = FirebaseOptions.builder()
        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
        .build();
        file.delete();
        return FirebaseApp.initializeApp(options);
    }

    public static void createFileFromString(String filePath, String content) throws IOException {

        File file = new File(filePath);
        // Fix for beanstalk (since it replaces \n for n)
        content = content.replaceAll("#", "\n");
        // Create parent directories if they don't exist
        File parent = file.getParentFile();
        if (parent != null) {
        parent.mkdirs();
        }

        // Write content to file
        try (FileWriter writer = new FileWriter(file)) {
        writer.write(content);
        }
    }

}