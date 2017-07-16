package com.newtonjoshua;

import java.io.IOException;

import javax.servlet.http.*;

import com.google.appengine.labs.repackaged.org.json.JSONException;
import com.google.appengine.labs.repackaged.org.json.JSONObject;

@SuppressWarnings("serial")
public class SteamFeeds_servlet extends HttpServlet {
	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		JSONObject result = null;

		try {
			result = SteamFeeds.getFeeds();
		} catch (JSONException e) {

			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		resp.addHeader("Access-Control-Allow-Origin", "*");
		resp.setContentType("application/json");
		resp.getWriter().println(result);
	}
}

// ~ Formatted by Jindent --- http://www.jindent.com
