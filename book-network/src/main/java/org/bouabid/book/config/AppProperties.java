package org.bouabid.book.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Setter
@Getter
@Component
@ConfigurationProperties(prefix = "application")
public class AppProperties {

    private Cors cors;


    @Setter
    @Getter
    public static class Cors {
        private List<String> origins;

    }

}
