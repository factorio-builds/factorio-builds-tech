package tech.factorio.fbsrwrapper;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.zalando.problem.ProblemModule;

@SpringBootApplication
public class FbsrWrapperApplication {

    @Configuration
    public static class JacksonConfiguration {

        @Bean
        public ObjectMapper objectMapper() {
            return new ObjectMapper()
                .registerModule(new ProblemModule().withStackTraces());
        }
    }


    public static void main(String[] args) {
        SpringApplication.run(FbsrWrapperApplication.class, args);
    }

}
