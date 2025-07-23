package com.odev.FileReader.service;

import com.odev.FileReader.dto.PersonDTO;
import com.odev.FileReader.model.Person;
import com.odev.FileReader.repository.PersonRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.xml.bind.JAXBContext;
import jakarta.xml.bind.Unmarshaller;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PersonService {
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private Validator validator;
    @Autowired
    private ObjectMapper objectMapper;

    // JSON dosyalarını işle
    @Transactional
    public Map<String, Object> processJsonFiles(MultipartFile[] files) {
        List<Person> validList = new ArrayList<>();
        List<Map<String, Object>> errors = new ArrayList<>();
        for (MultipartFile file : files) {
            try (InputStream is = file.getInputStream()) {
                PersonDTO[] dtos = objectMapper.readValue(is, PersonDTO[].class);
                for (PersonDTO dto : dtos) {
                    Set<ConstraintViolation<PersonDTO>> violations = validator.validate(dto);
                    boolean exists = personRepository.existsByEmail(dto.getEmail());
                    if (violations.isEmpty() && !exists) {
                        Person p = new Person();
                        p.setName(dto.getName());
                        p.setEmail(dto.getEmail());
                        p.setAge(dto.getAge());
                        validList.add(p);
                    } else {
                        Map<String, Object> err = new HashMap<>();
                        err.put("file", file.getOriginalFilename());
                        err.put("record", dto);
                        List<String> messages = violations.stream().map(ConstraintViolation::getMessage).collect(Collectors.toList());
                        if (exists) messages.add("Bu email zaten kayıtlı: " + dto.getEmail());
                        err.put("messages", messages);
                        errors.add(err);
                    }
                }
                if (!validList.isEmpty()) personRepository.saveAll(validList);
            } catch (Exception e) {
                Map<String, Object> err = new HashMap<>();
                err.put("file", file.getOriginalFilename());
                err.put("error", e.getMessage());
                errors.add(err);
            }
        }
        Map<String, Object> result = new HashMap<>();
        result.put("successCount", validList.size());
        result.put("errorList", errors);
        return result;
    }

    // XML dosyalarını işle
    @Transactional
    public Map<String, Object> processXmlFiles(MultipartFile[] files) {
        List<Person> validList = new ArrayList<>();
        List<Map<String, Object>> errors = new ArrayList<>();
        for (MultipartFile file : files) {
            try (InputStream is = file.getInputStream()) {
                JAXBContext context = JAXBContext.newInstance(PersonListDTO.class);
                Unmarshaller unmarshaller = context.createUnmarshaller();
                PersonListDTO personList = (PersonListDTO) unmarshaller.unmarshal(is);
                for (PersonDTO dto : personList.getPersons()) {
                    Set<ConstraintViolation<PersonDTO>> violations = validator.validate(dto);
                    boolean exists = personRepository.existsByEmail(dto.getEmail());
                    if (violations.isEmpty() && !exists) {
                        Person p = new Person();
                        p.setName(dto.getName());
                        p.setEmail(dto.getEmail());
                        p.setAge(dto.getAge());
                        validList.add(p);
                    } else {
                        Map<String, Object> err = new HashMap<>();
                        err.put("file", file.getOriginalFilename());
                        err.put("record", dto);
                        List<String> messages = violations.stream().map(ConstraintViolation::getMessage).collect(Collectors.toList());
                        if (exists) messages.add("Bu email zaten kayıtlı: " + dto.getEmail());
                        err.put("messages", messages);
                        errors.add(err);
                    }
                }
                if (!validList.isEmpty()) personRepository.saveAll(validList);
            } catch (Exception e) {
                Map<String, Object> err = new HashMap<>();
                err.put("file", file.getOriginalFilename());
                err.put("error", e.getMessage());
                errors.add(err);
            }
        }
        Map<String, Object> result = new HashMap<>();
        result.put("successCount", validList.size());
        result.put("errorList", errors);
        return result;
    }

    // XML için yardımcı DTO
    @jakarta.xml.bind.annotation.XmlRootElement(name = "persons")
    @jakarta.xml.bind.annotation.XmlAccessorType(jakarta.xml.bind.annotation.XmlAccessType.FIELD)
    public static class PersonListDTO {
        @jakarta.xml.bind.annotation.XmlElement(name = "person")
        private List<PersonDTO> persons;
        public List<PersonDTO> getPersons() { return persons; }
        public void setPersons(List<PersonDTO> persons) { this.persons = persons; }
    }

    public List<Person> getAllPersons() {
    return personRepository.findAll();
}
} 