package com.example.scripts;

import com.example.driver.TestDriver;
import com.example.function.TestFunctionLib;
import org.openqa.selenium.WebDriver;
import org.testng.annotations.Test;

public class BrowserTest extends TestDriver {

    public BrowserTest() {
        // Call the constructor of TestDriver to ensure WebDriver is set up
        super();
    }

    @Test
    public void testExample() {
        WebDriver driver = getDriver(); // Get WebDriver instance from TestDriver
        driver.get("https://www.google.com");

        TestFunctionLib.waitFor(10);
    }

    // You can add more @Test methods here
}
