package com.beegenius.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class SupabaseStorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.bucket}")
    private String bucketName;

    @Value("${supabase.key}")
    private String supabaseKey;

    public String uploadFile(MultipartFile file, String subfolder) throws IOException {
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        String objectPath = subfolder + "/" + filename;
        String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + objectPath;

        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", supabaseKey);
        headers.set("Authorization", "Bearer " + supabaseKey);
        headers.setContentType(MediaType.parseMediaType(file.getContentType()));

        HttpEntity<byte[]> requestEntity = new HttpEntity<>(file.getBytes(), headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.exchange(uploadUrl, HttpMethod.PUT, requestEntity, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            log.info("File uploaded to Supabase: {}", objectPath);
            return supabaseUrl + "/storage/v1/object/public/" + bucketName + "/" + objectPath;
        } else {
            log.error("Failed to upload file to Supabase: {}", response.getStatusCode());
            throw new IOException("Upload failed: " + response.getStatusCode());
        }
    }

    public void deleteFile(String filePathInBucket) {
        String url = supabaseUrl + "/storage/v1/object/" + filePathInBucket;


        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", supabaseKey);
        headers.set("Authorization", "Bearer " + supabaseKey);

        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
        RestTemplate restTemplate = new RestTemplate();

        try {
            restTemplate.exchange(url, HttpMethod.DELETE, requestEntity, String.class);
            log.info("Deleted file from Supabase: {}", filePathInBucket);
        } catch (Exception e) {
            log.error("Failed to delete file from Supabase: {}", filePathInBucket, e);
        }
    }

    public String uploadFile(String pathInBucket, byte[] fileContent, String contentType) {
        String url = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + pathInBucket;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + supabaseKey);
        headers.set("Content-Type", contentType);
        headers.set("x-upsert", "true");

        HttpEntity<byte[]> requestEntity = new HttpEntity<>(fileContent, headers);
        RestTemplate restTemplate = new RestTemplate();

        try {
            restTemplate.exchange(url, HttpMethod.PUT, requestEntity, String.class);
            return supabaseUrl + "/storage/v1/object/public/" + pathInBucket;
        } catch (Exception e) {
            log.error("Failed to upload file to Supabase: {}", pathInBucket, e);
            throw new RuntimeException("Supabase upload failed");
        }
    }

}
