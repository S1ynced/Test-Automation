package com.example.function;

import com.example.driver.TestDriver;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.util.function.Function;

public class TestFunctionLib {

    public static void waitFor(int seconds) {
        WebDriver driver = TestDriver.getDriver(); // Get WebDriver instance from TestDriver
        WebDriverWait wait = new WebDriverWait(driver, seconds);
        wait.until(new Function<WebDriver, Boolean>() {
            public Boolean apply(WebDriver driver) {
                try {
                    Thread.sleep(seconds * 1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                return true;
            }
        });
    }
}
