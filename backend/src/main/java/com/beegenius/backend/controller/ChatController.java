package com.beegenius.backend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.sql.SQLOutput;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Value("${openrouter.api.key}")
    private String apiKey;

    @PostMapping
    public Map<String, String> chat(@RequestBody Map<String, Object> body) throws IOException, InterruptedException {

        var messages = body.get("messages");
        System.out.println(apiKey);

        String json = new ObjectMapper().writeValueAsString(Map.of(
                "model", "openai/gpt-3.5-turbo",
                "messages", messages
        ));

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://openrouter.ai/api/v1/chat/completions"))
                .header("Authorization", "Bearer " + apiKey)
                .header("HTTP-Referer", "http://localhost:3000")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        JsonNode root = new ObjectMapper().readTree(response.body());
        String reply = root.get("choices").get(0).get("message").get("content").asText();

        return Map.of("reply", reply);
    }
}
