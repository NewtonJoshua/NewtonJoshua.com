
/**
 *
 */
package com.newtonjoshua;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import java.net.HttpURLConnection;
import java.net.URL;

import com.google.appengine.labs.repackaged.org.json.JSONException;
import com.google.appengine.labs.repackaged.org.json.JSONObject;

/**
 * @author Newton Joshua
 *
 */
public class HttpGet {
	public static JSONObject get(String inputUrl) throws IOException, JSONException {
		URL url = new URL(inputUrl);
		HttpURLConnection conn = (HttpURLConnection) url.openConnection();

		conn.setRequestMethod("GET");

		String line, outputString = "";
		BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));

		while ((line = reader.readLine()) != null) {
			outputString += line;
		}

		return new JSONObject(outputString);
	}
}

// ~ Formatted by Jindent --- http://www.jindent.com
