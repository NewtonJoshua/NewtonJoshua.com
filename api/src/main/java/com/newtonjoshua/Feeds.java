package com.newtonjoshua;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import com.google.appengine.labs.repackaged.org.json.JSONException;
import com.google.appengine.labs.repackaged.org.json.JSONObject;
import com.google.appengine.labs.repackaged.org.json.XML;

public class Feeds {
	public static int PRETTY_PRINT_INDENT_FACTOR = 4;

	public static JSONObject getFeeds(String inputUrl) throws Exception {
		URL url = new URL(inputUrl);
		HttpURLConnection conn = (HttpURLConnection) url.openConnection();

		conn.setRequestMethod("GET");

		String line, outputString = "";
		BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));

		while ((line = reader.readLine()) != null) {
			outputString += line;
		}
		
		JSONObject xmlJSONObj = null;
		
		try {
            xmlJSONObj = XML.toJSONObject(outputString);
            String jsonPrettyPrintString = xmlJSONObj.toString(PRETTY_PRINT_INDENT_FACTOR);
        } catch (JSONException je) {
            System.out.println(je.toString());
        }
		return xmlJSONObj;	
	}
}
