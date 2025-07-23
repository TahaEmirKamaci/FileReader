package com.odev.FileReader.controller;

import com.odev.FileReader.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin
public class UploadController {

    @Autowired
    private PersonService personService;

    @PostMapping("/json")
    public ResponseEntity<?> uploadJson(@RequestParam("files") MultipartFile[] files) {
        Map<String, Object> result = personService.processJsonFiles(files);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/xml")
    public ResponseEntity<?> uploadXml(@RequestParam("files") MultipartFile[] files) {
        Map<String, Object> result = personService.processXmlFiles(files);
        return ResponseEntity.ok(result);
    }
} 