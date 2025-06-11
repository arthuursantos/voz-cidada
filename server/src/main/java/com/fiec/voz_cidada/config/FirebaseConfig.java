package com.fiec.voz_cidada.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.*;

@Configuration
public class FirebaseConfig {

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        String pkContent = System.getenv("FIREBASE_PK");

        if (pkContent == null) {
            System.out.println("Variável de ambiente FIREBASE_PK não está definida. Ignorando Firebase.");
            return null; // ou lançar uma exceção customizada se preferir
        }

        File file = new File("firebase.json");
        createFileFromString("firebase.json", pkContent);
        InputStream serviceAccount = new FileInputStream(file);
        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();
        file.delete();
        return FirebaseApp.initializeApp(options);
    }

    public static void createFileFromString(String filePath, String content) throws IOException {
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("FIREBASE_PK não está definido ou está vazio.");
        }

        File file = new File(filePath);


        File parent = file.getParentFile();
        if (parent != null) {
            parent.mkdirs();
        }


        try (FileWriter writer = new FileWriter(file)) {
            writer.write(content);
        }
    }

}