package com.fiec.voz_cidada.controller;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectResult;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class ChamadoUploadController {

    private final AmazonS3 s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    public ChamadoUploadController(AmazonS3 s3Client) {
        this.s3Client = s3Client;
    }

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            S3Object s3Object = s3Client.getObject(bucketName, filename);
            S3ObjectInputStream inputStream = s3Object.getObjectContent();

            MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
            if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
                mediaType = MediaType.IMAGE_JPEG;
            } else if (filename.toLowerCase().endsWith(".png")) {
                mediaType = MediaType.IMAGE_PNG;
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentLength(s3Object.getObjectMetadata().getContentLength());
            headers.setContentType(mediaType);
            headers.setContentDispositionFormData("attachment", filename);

            return new ResponseEntity<>(new InputStreamResource(inputStream), headers, HttpStatus.OK);

        } catch (Exception e) {
            throw new RuntimeException("Não foi possível recuperar o upload.") ;
        }
    }

    @PostMapping("/file")
    public void saveImage(@RequestParam("image") MultipartFile image) {
        try {
            String originalFilename = image.getOriginalFilename();
            String filename = UUID.randomUUID().toString() + "_" + originalFilename;

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(image.getSize());
            metadata.setContentType(image.getContentType());

            PutObjectResult putObjectResult = s3Client.putObject(bucketName, filename, image.getInputStream(), metadata);

        } catch (Exception e) {
            throw new RuntimeException("Não foi possível fazer upload da imagem.");
        }
    }
}